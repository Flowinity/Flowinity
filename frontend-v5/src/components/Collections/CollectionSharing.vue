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
            $toast.success(t('generic.copied'));
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
      <tpu-data-table :items="users" :headers="headers" class="pt-2">
        <template v-slot:item.user.username="{ item }: any">
          <div class="flex items-center gap-2">
            <user-avatar
              :avatar="item.user.avatar"
              :user-id="item.user.id"
              :username="item.user.username"
              size="22"
            ></user-avatar>
            <div class="flex flex-col">
              {{ item.user.username }}
              <span class="text-medium-emphasis-dark" v-if="!item.accepted">
                {{ t("collections.sharing.pending") }}
              </span>
            </div>
            <tpu-button
              v-if="item.user.id === collection.userId"
              icon
              variant="passive"
              color="yellow"
              v-tooltip.top="t('collections.sharing.owner')"
            >
              <RiVipCrownFill style="width: 20px" />
            </tpu-button>
          </div>
        </template>
        <template v-slot:item.read="{ item }: any">
          <tpu-checkbox
            size="s"
            class="items-center flex"
            :model-value="item.read"
            :disabled="true"
            :loading="loading"
          />
        </template>
        <template v-slot:item.write="{ item }: any">
          <tpu-checkbox
            size="s"
            :model-value="item.write"
            :loading="loading"
            class="justify-center flex"
            :disabled="
              item.configure ||
              item.recipientId === userStore.user?.id ||
              item.recipientId === collection.userId
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
        <template v-slot:item.configure="{ item }: any">
          <tpu-checkbox
            size="s"
            :model-value="item.configure"
            :disabled="
              item.recipientId === userStore.user?.id ||
              item.recipientId === collection.userId
            "
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
        <template v-slot:item.actions="{ item }: any">
          <danger-zone-dialog @confirm="transferOwnership($event)">
            <template #toolbar>
              {{ t("collections.transfer.title") }}
            </template>
            <template #content>
              <div class="flex flex-col items-center">
                <h2>
                  {{ t("collections.transfer.title") }}
                </h2>
                <p class="text-medium-emphasis-dark pb-4">
                  {{
                    t("collections.transfer.description", {
                      collection: collection.name,
                      user: transferUser?.username
                    })
                  }}
                </p>
                <div class="flex justify-center">
                  <user-avatar
                    :avatar="collection.avatar || collection.banner"
                    :username="collection.name"
                    size="70"
                  />
                  <RiArrowRightSLine style="width: 70px" />
                  <user-avatar
                    :user="transferUser"
                    :avatar="transferUser?.avatar"
                    :username="transferUser?.username"
                    :user-id="transferUser?.id"
                    size="70"
                  />
                </div>
              </div>
            </template>
            <template #default="{ toggle }">
              <tpu-button
                style="width: 40px; height: 40px"
                icon
                variant="passive"
                @click="
                  transferUser = item.user;
                  toggle();
                "
                v-if="
                  item.recipientId !== collection.userId &&
                  collection.userId === userStore.user?.id
                "
                :disabled="!item.accepted"
              >
                <RiUserSharedLine class="w-full h-full" />
              </tpu-button>
            </template>

            <template #actions="{ confirm }">
              <tpu-button
                variant="passive"
                :loading="loading"
                @click="confirm()"
              >
                {{ t("collections.transfer.action") }}
              </tpu-button>
            </template>
          </danger-zone-dialog>
          <tpu-button
            style="width: 40px; height: 40px"
            icon
            variant="passive"
            @click="removeUser(item.recipientId)"
            :disabled="item.recipientId === collection.userId"
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
import { Collection, PartialUserFriend } from "@/gql/graphql";
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
import UserAvatar from "@/components/User/UserAvatar.vue";
import RiVipCrownFill from "vue-remix-icons/icons/ri-vip-crown-fill.vue";
import RiUserSharedLine from "vue-remix-icons/icons/ri-user-shared-line.vue";
import DangerZoneDialog from "@/components/Core/Dialogs/DangerZoneDialog.vue";
import RiArrowRightSLine from "vue-remix-icons/icons/ri-arrow-right-s-line.vue";
import { TransferCollectionOwnership } from "@/graphql/collections/transferOwnership.graphql";

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

const transferUser = ref<undefined | PartialUserFriend>(undefined);
async function transferOwnership(args: {
  passwordMode: boolean;
  password: string;
  totp: string;
}) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: TransferCollectionOwnership,
      variables: {
        input: {
          password: args.passwordMode ? args.password : undefined,
          totp: !args.passwordMode ? args.totp : undefined,
          collectionId: props.collection?.id,
          userId: transferUser.value?.id
        }
      }
    });
    emit("update:modelValue", false);
  } finally {
    loading.value = false;
  }
}

const users = computed(() => {
  return [
    {
      recipientId: props.collection?.user?.id,
      user: props.collection?.user || {},
      read: true,
      write: true,
      configure: true,
      accepted: true
    },
    ...(props.collection?.users || [])
  ];
});

watch(
  () => [collectionStore.selected, props.modelValue],
  () => {
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
