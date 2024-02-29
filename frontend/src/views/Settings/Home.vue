<template>
  <div>
    <v-card-title>{{ $t("settings.home.myAccount.title") }}</v-card-title>
    <v-expansion-panels class="px-4">
      <v-expansion-panel :title="$t('settings.home.myAccount.changeUsername')">
        <v-expansion-panel-text>
          <v-form v-model="valid.username">
            <v-text-field
              v-model="username.username"
              :label="$t('settings.home.myAccount.username')"
              :rules="$validation.user.username"
              class="mt-4"
            />
            <DangerZoneInput
              v-model:password="username.password"
              v-model:password-mode="username.passwordMode"
              v-model:totp="username.totp"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.username"
                color="primary"
                @click="changeUsername"
              >
                {{ $t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :title="$t('settings.home.myAccount.changePassword')">
        <v-expansion-panel-text>
          <v-form v-model="valid.password">
            <danger-zone-input
              v-model:password="password.password"
              v-model:totp="password.totp"
              :both="true"
            ></danger-zone-input>
            <v-text-field
              v-model="password.newPassword"
              :label="$t('settings.home.myAccount.newPassword')"
              class="mt-4"
              type="password"
            />
            <v-text-field
              v-model="password.confirmNewPassword"
              :label="$t('settings.home.myAccount.confirmPassword')"
              :rules="[...$validation.user.passwordSettings]"
              class="mt-4"
              type="password"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.password"
                color="primary"
                @click="changePassword()"
              >
                {{ $t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :title="$t('settings.home.myAccount.changeEmail')">
        <v-expansion-panel-text>
          <v-form v-model="valid.email">
            <v-text-field
              v-model="email.email"
              :label="$t('settings.home.myAccount.email')"
              :rules="$validation.user.email"
              class="mt-4"
            />
            <DangerZoneInput
              v-model:password="email.password"
              v-model:password-mode="email.passwordMode"
              v-model:totp="email.totp"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.username"
                color="primary"
                @click="changeEmail"
              >
                {{ $t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title class="bg-card">
          {{ $t("settings.home.myAccount.2fa") }}
          <v-chip
            v-if="$user.user?.totpEnable"
            class="ml-2"
            color="green"
            label
            size="small"
          >
            {{ $t("generic.enabled") }}
          </v-chip>
          <v-chip v-else class="ml-2" color="error" label size="small">
            {{ $t("generic.disabled") }}
          </v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <TwoFactor />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel class="text-red v-card--variant-tonal">
        <span class="v-card__underlay"></span>
        <v-expansion-panel-title>
          {{ $t("settings.home.deleteAccount.title") }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card-text style="white-space: pre-line">
            {{ $t("settings.home.deleteAccount.description") }}
          </v-card-text>
          <v-card-actions>
            <danger-zone-dialog :require-both="true" @confirm="deleteAccount">
              <template #title>
                {{ $t("settings.home.deleteAccount.title") }}
              </template>
              <template #content>
                {{ $t("settings.home.deleteAccount.deleteText") }}
              </template>
              <template #default="{ toggle }">
                <v-btn
                  color="red"
                  :loading="deletion.deleting"
                  variant="tonal"
                  @click="toggle()"
                >
                  {{ $t("settings.home.deleteAccount.delete") }}
                </v-btn>
              </template>
              <template #actions="{ confirm }">
                <v-btn
                  color="red"
                  :loading="deletion.deleting"
                  @click="confirm()"
                >
                  {{ $t("settings.home.deleteAccount.delete") }}
                </v-btn>
              </template>
            </danger-zone-dialog>
            <v-btn
              color="red"
              variant="tonal"
              :loading="deletion.purging"
              @click="purgeGallery"
            >
              {{ $t("settings.home.deleteAccount.purgeGallery") }}
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-title>{{ $t("settings.home.preferences.title") }}</v-card-title>
    <v-slider
      v-model="$user.user.itemsPerPage"
      :label="$t('settings.home.preferences.itemsPerPage')"
      class="px-4"
      max="72"
      min="12"
      step="12"
      thumb-label
      @update:model-value="$emit('update')"
    />
    <!-- select between Farenheit, Celsius or Kelvin -->
    <v-select
      v-model="$user.user.weatherUnit"
      :items="temperatureUnits"
      :label="$t('settings.home.preferences.tempUnit')"
      class="px-6"
      item-title="title"
      item-value="value"
      @update:model-value="$emit('update')"
    />
    <v-select
      v-model="theme"
      :items="themes"
      :label="$t('settings.home.preferences.theme')"
      class="px-6"
      item-title="title"
      item-value="value"
      @update:model-value="$emit('update')"
    />
    <v-switch
      :model-value="!!$experiments.experiments.PRIDE"
      :label="$t('settings.home.preferences.pride')"
      class="px-6"
      @update:model-value="$experiments.setExperiment('PRIDE', $event ? 1 : 0)"
    />
    <v-autocomplete
      v-model="$user.user.excludedCollections"
      :items="collections"
      :label="$t('settings.home.preferences.baseCollections')"
      chips
      class="px-6"
      closable-chips
      color="primary"
      item-title="name"
      item-value="id"
      multiple
      variant="underlined"
      @update:model-value="$emit('update')"
    />
    <v-select
      v-model="$user.user.language"
      :items="languages"
      :label="$t('settings.home.preferences.language')"
      class="px-6"
      item-title="title"
      item-value="key"
      @update:model-value="$emit('update')"
    />
    <v-select
      v-model="$experiments.experiments['NOTIFICATION_SOUND']"
      :items="notificationSounds"
      class="px-6"
      item-title="title"
      item-value="key"
      label="Notification Sound"
    />
    <v-btn
      v-if="$user.gold || !$app.site.officialInstance"
      class="mb-2 ml-5"
      @click="$app.themeEditor = !$app.themeEditor"
    >
      <v-icon class="mr-2">mdi-palette</v-icon>
      <span>
        {{ $t("settings.home.preferences.themeEditor") }}
        <v-chip size="x-small">{{ $t("generic.new") }}</v-chip>
      </span>
    </v-btn>
    <v-switch
      v-model="disableProfileColors"
      :label="$t('settings.home.preferences.disableProfileColors')"
      class="px-6"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwoFactor from "@/components/Settings/TwoFactor.vue";
import { useTheme } from "vuetify";
import { Collection, UserInsights } from "@/gql/graphql";
import { UserLightCollectionsQuery } from "@/graphql/collections/getUserCollections.graphql";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import {
  ChangeUserEmailMutation,
  ChangeUsernameMutation,
  ChangeUserPasswordMutation
} from "@/graphql/user/changeUsername.graphql";
import DangerZoneDialog from "@/components/Core/DangerZoneDialog.vue";
import { DeleteAccountMutation } from "@/graphql/user/deleteAccount.graphql";

export default defineComponent({
  name: "SettingsHome",
  components: { DangerZoneDialog, DangerZoneInput, TwoFactor },
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
      email: {
        password: "",
        totp: "",
        email: "",
        passwordMode: false
      },
      password: {
        confirmNewPassword: "",
        newPassword: "",
        password: "",
        totp: ""
      },
      username: {
        username: "",
        password: "",
        totp: "",
        passwordMode: false
      },
      collections: [] as Collection[],
      notificationSounds: [
        {
          title: "Default",
          key: 1
        },
        {
          title: "Classic",
          key: 2
        },
        {
          title: "KDE",
          key: 3
        }
      ],
      languages: [
        {
          title: "English (United States)",
          key: "en"
        },
        {
          title: "English (United Kingdom)",
          key: "en-GB"
        },
        {
          title: "Русский (Россия)",
          key: "ru"
        },
        {
          title: "French",
          key: "fr"
        }
      ],
      theme: useTheme().global.name,
      themes: [
        { title: "Light", value: "light" },
        { title: "Dark", value: "dark" },
        { title: "AMOLED", value: "amoled" }
      ],
      temperatureUnits: [
        { title: "Celsius (Metric)", value: "celsius" },
        { title: "Kelvin (Metric Standard)", value: "kelvin" },
        { title: "Fahrenheit (Imperial)", value: "fahrenheit" }
      ],
      insights: [
        { title: "Everyone", value: UserInsights.Everyone },
        { title: "Friends", value: UserInsights.Friends },
        { title: "Nobody", value: UserInsights.Nobody }
      ],
      confirmPassword: "",
      valid: {
        password: true,
        username: true,
        email: true
      },
      deletion: {
        deleting: false,
        purging: false
      }
    };
  },
  computed: {
    disableProfileColors: {
      get() {
        try {
          this.$user.disableProfileColors;
          return JSON.parse(localStorage.getItem("disableProfileColors")!);
        } catch {
          return false;
        }
      },
      set(val: boolean) {
        this.$user.disableProfileColors = val;
        localStorage.setItem("disableProfileColors", JSON.stringify(val));
      }
    },
    disableBatterySave: {
      get() {
        try {
          return JSON.parse(localStorage.getItem("disableBatterySave")!);
        } catch {
          return false;
        }
      },
      set(val: boolean) {
        localStorage.setItem("disableBatterySave", JSON.stringify(val));
      }
    }
  },
  watch: {
    theme() {
      this.toggleTheme(this.theme);
    },
    "$experiments.experiments.NOTIFICATION_SOUND"(val) {
      this.$chat.sound();
      this.$experiments.setExperiment("NOTIFICATION_SOUND", val);
    }
  },
  async mounted() {
    this.$app.title = "Settings";
    const {
      data: {
        collections: { items }
      }
    } = await this.$apollo.query({
      query: UserLightCollectionsQuery,
      variables: {
        input: {
          limit: 99999
        }
      }
    });
    this.collections = items;
  },
  methods: {
    async changeEmail() {
      await this.$apollo.mutate({
        mutation: ChangeUserEmailMutation,
        variables: {
          input: {
            email: this.email.email,
            password: this.email.passwordMode ? this.email.password : undefined,
            totp: this.email.passwordMode ? undefined : this.email.totp
          }
        }
      });
      this.$user.user.email = this.email.email;
      this.$user.user.emailVerified = false;
      this.$toast.success("Your email has been updated!");
    },
    async changePassword() {
      if (this.password.newPassword !== this.password.confirmNewPassword) {
        return this.$toast.error("Password doesn't match.");
      }
      await this.$apollo.mutate({
        mutation: ChangeUserPasswordMutation,
        variables: {
          input: {
            newPassword: this.password.newPassword,
            currentPassword: this.password.password,
            totp: this.password.totp
          }
        }
      });
      this.$toast.success("Your password has been updated!");
    },
    async changeUsername() {
      await this.$apollo.mutate({
        mutation: ChangeUsernameMutation,
        variables: {
          input: {
            username: this.username.username,
            password: this.username.passwordMode
              ? this.username.password
              : undefined,
            totp: this.username.passwordMode ? undefined : this.username.totp
          }
        }
      });
      this.$toast.success("Your username has been updated!");
    },
    async deleteAccount(dangerZone: { password: string; totp: string }) {
      this.deletion.deleting = true;
      try {
        await this.$apollo.mutate({
          mutation: DeleteAccountMutation,
          variables: {
            input: {
              password: dangerZone.password,
              totp: dangerZone.totp
            }
          }
        });
        this.$toast.success("Your account has been deleted!");
        await this.$router.push("/");
      } finally {
        this.deletion.deleting = false;
      }
    }
  }
});
</script>
