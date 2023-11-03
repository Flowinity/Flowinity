<template>
  <card style="max-width: 500px">
    <tpu-list>
      <tpu-list-item @click="changeStatus(UserStoredStatus.Online)">
        <div class="flex items-center gap-2">
          <user-avatar
            :user-id="userStore.user?.id"
            :fake-status="UserStoredStatus.Online"
            :status="true"
          />
          <p class="test-lg">
            {{ t("settings.status.online.title") }}
          </p>
        </div>
      </tpu-list-item>
      <tpu-list-item @click="changeStatus(UserStoredStatus.Busy)">
        <div class="flex items-center gap-2">
          <user-avatar
            :user-id="userStore.user?.id"
            :fake-status="UserStoredStatus.Busy"
            :status="true"
          />
          <div>
            <p class="test-lg">
              {{ t("settings.status.busy.title") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.status.busy.description") }}
            </p>
          </div>
        </div>
      </tpu-list-item>
      <tpu-list-item @click="changeStatus(UserStoredStatus.Idle)">
        <div class="flex items-center gap-2">
          <user-avatar
            :user-id="userStore.user?.id"
            :fake-status="UserStoredStatus.Idle"
            :status="true"
          />
          <div>
            <p class="test-lg">
              {{ t("settings.status.idle.title") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.status.idle.description") }}
            </p>
          </div>
        </div>
      </tpu-list-item>
      <tpu-list-item @click="changeStatus(UserStoredStatus.Invisible)">
        <div class="flex items-center gap-2">
          <user-avatar
            :user-id="userStore.user?.id"
            :fake-status="UserStatus.Offline"
            :status="true"
          />
          <div>
            <p class="test-lg">
              {{ t("settings.status.invisible.title") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.status.invisible.description") }}
            </p>
          </div>
        </div>
      </tpu-list-item>
    </tpu-list>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useUserStore } from "@/stores/user.store";
import { useI18n } from "vue-i18n";
import { UserStatus, UserStoredStatus } from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateUserStatusMutation } from "@/graphql/user/update.graphql";

const { t } = useI18n();
const userStore = useUserStore();

async function changeStatus(status: UserStoredStatus) {
  await useApolloClient().client.mutate({
    mutation: UpdateUserStatusMutation,
    variables: {
      input: {
        storedStatus: status
      }
    }
  });
}
</script>

<style scoped></style>
