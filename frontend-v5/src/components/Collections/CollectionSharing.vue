<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="600"
  >
    <template #toolbar>
      {{ t("collections.sharing.title") }}
    </template>
    <div class="py-4 px-4" v-if="collection">
      <tpu-select
        label="ShareLink visibility"
        v-model="shareLinkVisibility"
        :items="shareLinkOptions"
        @update:model-value="updateCollection"
      />
      <p v-if="shareLinkVisibility">
        Your collection can be accessed from:
        <a
          class="text-blue"
          @click.prevent="
            functions.copy(
              `${appStore.state.hostnameWithProtocol}/collections/${shareLink}`
            );
            useToast().success('Copied to clipboard!');
          "
          :href="`${appStore.state.hostnameWithProtocol}/collections/${shareLink}`"
        >
          {{ appStore.state.hostnameWithProtocol }}/collections/{{ shareLink }}
        </a>
      </p>
      <div class="flex items-center">
        <tpu-auto-complete
          class="flex-1"
          :items="friends"
          v-model="friend"
          :label="t('collections.sharing.add')"
          @keydown.enter="friend ? addUser : () => {}"
        />
        <tpu-button
          icon
          variant="passive"
          style="width: 40px; height: 40px"
          @click="addUser"
          :disabled="!friend"
        >
          <RiAddLine />
        </tpu-button>
      </div>
      <tpu-data-table :items="collection.users" :headers="headers" class="pt-2">
        <template v-slot:item.read="{ item }">
          <tpu-checkbox
            size="s"
            class="items-center flex"
            :model-value="item.read"
            :disabled="true"
            :loading="loading"
          />
        </template>
        <template v-slot:item.write="{ item }">
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
        <template v-slot:item.configure="{ item }">
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
        <template v-slot:item.actions="{ item }">
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
        color="blue"
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
import TextField from "@/components/Framework/Input/TextField.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { useAppStore } from "@/stores/app.store";
import functions from "@/plugins/functions";
import { useToast } from "vue-toastification";
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
