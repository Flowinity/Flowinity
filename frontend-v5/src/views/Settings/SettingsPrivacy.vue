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
        :label="t('settings.privacy.usageInformation')"
        @update:model-value="userStore.updateUser()"
      />
      <p class="text-sm">{{ t("settings.privacy.usageInformationDesc") }}</p>
      <tpu-switch
        v-model="userStore.user!.publicProfile"
        :label="t('settings.privacy.publicProfile')"
        @update:model-value="userStore.updateUser()"
      />
      <p class="text-sm">
        {{ t("settings.privacy.publicProfileDesc") }}
      </p>
      <tpu-switch
        :model-value="false"
        :label="t('settings.privacy.discordPrecache')"
        :disabled="true"
      />
      <p class="text-sm mb-4">
        {{ t("settings.privacy.discordPrecacheDeprecationNotice") }}
      </p>
      <tpu-select
        v-model="userStore.user!.insights"
        :items="options.insights"
        :label="$t('settings.home.privacy.insightsPrivacy')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
      <tpu-select
        v-model="userStore.user!.groupPrivacy"
        :items="options.group"
        :label="$t('settings.home.privacy.groupPrivacy')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
      <tpu-select
        v-model="userStore.user!.friendRequests"
        :items="options.friend"
        :label="$t('settings.home.privacy.friendPrivacy')"
        @update:model-value="userStore.updateUser()"
      ></tpu-select>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useI18n } from "vue-i18n";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import {
  UserInsights,
  UserGroupPrivacy,
  UserFriendRequestPrivacy
} from "@/gql/graphql";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import TpuDivider from "@/components/Framework/Divider/TpuDivider.vue";

const userStore = useUserStore();
const { t } = useI18n();
const options = {
  insights: [
    {
      name: t("settings.privacy.options.everyone"),
      id: UserInsights.Everyone
    },
    {
      name: t("settings.privacy.options.friends"),
      id: UserInsights.Friends
    },
    { name: t("settings.privacy.options.nobody"), id: UserInsights.Nobody }
  ],
  group: [
    {
      name: t("settings.privacy.options.everyone"),
      id: UserGroupPrivacy.Friends
    },
    {
      name: t("settings.privacy.options.nobody"),
      id: UserGroupPrivacy.Nobody
    }
  ],
  friend: [
    {
      name: t("settings.privacy.options.everyone"),
      id: UserFriendRequestPrivacy.Everyone
    },
    {
      name: t("settings.privacy.options.nobody"),
      id: UserFriendRequestPrivacy.Nobody
    }
  ]
};
</script>

<style scoped></style>
