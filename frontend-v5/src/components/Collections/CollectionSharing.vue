<template>
  <tpu-dialog
    :model-value="modelValue"
    width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ t("collections.sharing.title") }}
    </template>
    <div v-if="collection" class="py-4 px-4">
      <tpu-select
        v-model="shareLinkVisibility"
        label="ShareLink visibility"
        :items="shareLinkOptions"
        @update:model-value="updateCollection"
      />
      <p v-if="shareLinkVisibility">
        Your collection can be accessed from:
        <a
          class="text-blue"
          :href="`${appStore.state.hostnameWithProtocol}/collections/${shareLink}`"
          @click.prevent="
            functions.copy(
              `${appStore.state.hostnameWithProtocol}/collections/${shareLink}`
            );
            $toast.success(t('generic.copied'));
          "
        >
          {{ appStore.state.hostnameWithProtocol }}/collections/{{ shareLink }}
        </a>
      </p>
      <div class="flex items-center">
        <tpu-auto-complete
          v-model="friend"
          class="flex-1"
          :items="friends"
          :label="t('collections.sharing.add')"
          @keydown.enter="friend ? addUser : () => {}"
        />
        <tpu-button
          icon
          variant="passive"
          style="width: 40px; height: 40px"
          :disabled="!friend"
          @click="addUser"
        >
          <RiAddLine />
        </tpu-button>
      </div>
      <tpu-data-table :items="collection.users" :headers="headers" class="pt-2">
        <template #item.read="{ item }">
          <tpu-checkbox
            size="s"
            class="items-center flex"
            :model-value="item.read"
            :disabled="true"
            :loading="loading"
          />
        </template>
        <template #item.write="{ item }">
          <tpu-checkbox
            size="s"
            :model-value="item.write"
            :loading="loading"
            class="justify-center flex"
            :disabled="
              item.configure || item.recipientId === userStore.user?.id
            "
            @update:model-value="
              updateCollectionUser(
                item.recipientId,
                item.read,
                $event,
                item.configure
              )
            "
          />
        </template>
        <template #item.configure="{ item }">
          <tpu-checkbox
            size="s"
            :model-value="item.configure"
            :disabled="item.recipientId === userStore.user?.id"
            :loading="loading"
            class="flex items-center"
            @update:model-value="
              updateCollectionUser(
                item.recipientId,
                item.read,
                $event ? true : item.write,
                $event
              )
            "
          />
        </template>
        <template #[`item.actions`]="{ item }">
          <tpu-button
            style="width: 40px; height: 40px"
            icon
            variant="passive"
            @click="removeUser(item.recipientId)"
          >
            <RiCloseLine class="w-full h-full" />
          </tpu-button>
        </template>
      </tpu-data-table>
    </div>
    <card-actions>
      <tpu-button
        variant="passive"
        :loading="loading"
        @click="$emit('update:modelValue', false)"
      >
        {{ t("generic.close") }}
      </tpu-button>
    </card-actions>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { useAppStore } from "@/stores/app.store";
import functions from "@/plugins/functions";
import { Collection } from "@/gql/graphql";
import TpuDataTable from "@/components/Framework/Table/TpuDataTable.vue";
import TpuCheckbox from "@/components/Framework/Input/TpuCheckbox.vue";
import {
  AddCollectionUserMutation,
  RemoveCollectionUser,
  UpdateCollectionUserPermissionsMutation
} from "@/graphql/collections/collectionUser.graphql";
import { useFriendsStore } from "@/stores/friends.store";
import TpuAutoComplete from "@/components/Framework/Input/TpuAutoComplete.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useUserStore } from "@/stores/user.store";

const shareLinkOptions = [
  {
    id: true,
    name: "Everyone with the link"
  },
  {
    id: false,
    name: "Nobody"
  }
];
const headers = [
  {
    id: "user.username",
    name: "Username"
  },
  {
    id: "read",
    name: "Read"
  },
  {
    id: "write",
    name: "Write"
  },
  {
    id: "configure",
    name: "Configure"
  },
  {
    id: "actions",
    name: "Actions"
  }
];
const friendsStore = useFriendsStore();
const userStore = useUserStore();
const shareLink = ref<string | null>(null);
const shareLinkVisibility = ref(false);
const props = defineProps({
  modelValue: Boolean,
  collection: Object as () => Collection
});
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();
const collectionStore = useCollectionsStore();
const loading = ref(false);
const appStore = useAppStore();
const friend = ref<undefined | number>(undefined);
watch(
  () => [collectionStore.selected, props.modelValue],
  () => {
    console.log(collectionStore.selected);
    shareLink.value = collectionStore.selected?.shareLink || null;
    shareLinkVisibility.value = !!collectionStore.selected?.shareLink;
  }
);

async function removeUser(userId: number) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: RemoveCollectionUser,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId
        }
      }
    });
  } finally {
    loading.value = false;
  }
}

async function addUser() {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: AddCollectionUserMutation,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId: friend.value,
          read: true,
          write: false,
          configure: false
        }
      }
    });
    friend.value = undefined;
  } finally {
    loading.value = false;
  }
}

async function updateCollection() {
  loading.value = true;
  try {
    const {
      data: { updateCollection }
    } = await useApolloClient().client.mutate({
      mutation: UpdateCollectionMutation,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          shareLink: shareLinkVisibility.value
        }
      }
    });
    shareLink.value = updateCollection.shareLink;
    shareLinkVisibility.value = !!updateCollection.shareLink;
  } finally {
    loading.value = false;
  }
}

async function updateCollectionUser(
  userId: number,
  read: boolean,
  write: boolean,
  configure: boolean
) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: UpdateCollectionUserPermissionsMutation,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId,
          read,
          write,
          configure
        }
      }
    });
  } finally {
    loading.value = false;
  }
}

const friends = computed(() => {
  return friendsStore.validFriends.map((fr) => {
    return { id: fr.user.id, name: fr.user.username };
  });
});

onMounted(() => {
  if (collectionStore.selected) {
    shareLink.value = collectionStore.selected.shareLink || null;
    shareLinkVisibility.value = !!shareLink.value;
  }
});
</script>

<style scoped></style>
