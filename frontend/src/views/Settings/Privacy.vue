<template>
  <div>
    <v-card-title>
      {{ $t("settings.home.privacy.title") }}
    </v-card-title>
    <v-card-text>
      <v-switch
        v-model="$user.user.pulse"
        class="mb-n7"
        :label="$t('settings.home.privacy.pulse')"
        @update:modelValue="$emit('update')"
      />
      <small>
        {{ $t("settings.home.privacy.pulseDesc") }}
      </small>
      <v-switch
        v-model="$user.user.discordPrecache"
        class="mb-n7"
        :label="$t('settings.home.privacy.discordPrecaching')"
        @update:modelValue="$emit('update')"
      />
      <small>
        {{ $t("settings.home.privacy.discordPrecachingDesc") }}
      </small>
      <v-switch
        v-model="$user.user.publicProfile"
        class="mb-n7"
        :label="$t('settings.home.privacy.publicProfile')"
        @update:modelValue="$emit('update')"
      />
      <small>
        {{ $t("settings.home.privacy.publicProfileDesc") }}
      </small>
      <v-select
        v-model="$user.user.insights"
        :items="insights"
        :label="$t('settings.home.preferences.insights')"
        class="mb-n2 mt-4"
        @update:modelValue="$emit('update')"
      />
      <small>
        {{ $t("settings.home.preferences.insightsDesc") }}
      </small>
      <v-switch
        v-if="$app.site.release === 'dev'"
        v-model="$app.demo"
        class="mb-n7"
        :label="$t('settings.home.privacy.demoMode')"
      />
      <v-select
        v-model="$user.user.groupPrivacy"
        :items="group"
        :label="$t('settings.home.privacy.groupPrivacy')"
        class="mb-n2 mt-4"
        @update:modelValue="$emit('update')"
      />
      <v-select
        v-model="$user.user.friendRequests"
        :items="friend"
        :label="$t('settings.home.privacy.friendPrivacy')"
        class="mb-n2 mt-4"
        @update:modelValue="$emit('update')"
      />
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwoFactor from "@/components/Settings/TwoFactor.vue";
import { useTheme } from "vuetify";
import {
  UserFriendRequestPrivacy,
  UserGroupPrivacy,
  UserInsights
} from "@/gql/graphql";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";

export default defineComponent({
  name: "SettingsHome",
  components: { DangerZoneInput, TwoFactor },
  emits: ["update"],
  setup() {
    const theme = useTheme();

    return {
      toggleTheme: (themeName: string) => {
        localStorage.setItem("theme", themeName);
        theme.global.name.value = themeName;
      }
    };
  },
  data() {
    return {
      insights: [
        { title: "Everyone", value: UserInsights.Everyone },
        { title: "Friends", value: UserInsights.Friends },
        { title: "Nobody", value: UserInsights.Nobody }
      ],
      group: [
        { title: "Everyone", value: UserGroupPrivacy.Friends },
        { title: "Nobody", value: UserGroupPrivacy.Nobody }
      ],
      friend: [
        { title: "Everyone", value: UserFriendRequestPrivacy.Everyone },
        { title: "Nobody", value: UserFriendRequestPrivacy.Nobody }
      ]
    };
  },
  async mounted() {
    this.$app.title = "Privacy Settings";
  }
});
</script>
