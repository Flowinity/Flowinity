<template>
  <card padding class="my-4 mx-4">
    <div class="flex flex-col gap-3 mb-4">
      <strong class="ml-1">
        {{ t("settings.privacy.title") }}
      </strong>
    </div>
    <div class="flex flex-col gap-1">
      <tpu-switch
        v-model="userStore.user!.pulse"
        :label="t('settings.privacy.usageInformation.title')"
        @update:model-value="userStore.updateUser()"
      />
      <p class="text-xs pb-2 pt-1">
        {{ t("settings.privacy.usageInformation.description") }}
      </p>
      <tpu-switch
        v-model="userStore.user!.publicProfile"
        :label="t('settings.privacy.publicProfile.title')"
        @update:model-value="userStore.updateUser()"
      />
      <p class="text-xs pb-2 pt-1">
        {{ t("settings.privacy.publicProfile.description") }}
      </p>
      <tpu-switch
        :model-value="false"
        :label="t('settings.privacy.discordPrecache.title')"
        :disabled="true"
      />
      <p class="text-xs pb-2 pt-1 mb-4">
        {{ t("settings.privacy.discordPrecache.description") }}
      </p>
      <tpu-select
        v-model="userStore.user!.insights"
        :items="options.insights"
        :label="$t('settings.privacy.insightsPrivacy.title')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
      <tpu-select
        v-model="userStore.user!.groupPrivacy"
        :items="options.group"
        :label="$t('settings.privacy.groupPrivacy.title')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
      <tpu-select
        v-model="userStore.user!.friendRequests"
        :items="options.friend"
        :label="$t('settings.privacy.friendRequestPrivacy.title')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useI18n } from "vue-i18n";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import { useUserStore } from "@/stores/user.store";
import {
  UserInsights,
  UserGroupPrivacy,
  UserFriendRequestPrivacy
} from "@/gql/graphql";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";

const userStore = useUserStore();
const { t } = useI18n();
const options = {
  insights: [
    {
      name: t("settings.privacy.insightsPrivacy.options.everyone"),
      id: UserInsights.Everyone
    },
    {
      name: t("settings.privacy.insightsPrivacy.options.friends"),
      id: UserInsights.Friends
    },
    { name: t("settings.privacy.insightsPrivacy.options.nobody"), id: UserInsights.Nobody }
  ],
  group: [
    {
      name: t("settings.privacy.groupPrivacy.options.everyone"),
      id: UserGroupPrivacy.Friends
    },
    {
      name: t("settings.privacy.groupPrivacy.options.nobody"),
      id: UserGroupPrivacy.Nobody
    }
  ],
  friend: [
    {
      name: t("settings.privacy.friendRequestPrivacy.options.everyone"),
      id: UserFriendRequestPrivacy.Everyone
    },
    {
      name: t("settings.privacy.friendRequestPrivacy.options.nobody"),
      id: UserFriendRequestPrivacy.Nobody
    }
  ]
};
</script>

<style scoped></style>
