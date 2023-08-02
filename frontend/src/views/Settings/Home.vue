<template>
  <v-card-title>
    {{ $t("settings.home.privacy.title") }}
  </v-card-title>
  <v-card-text>
    <v-switch
      v-model="$user.changes.discordPrecache"
      class="mb-n7"
      :label="$t('settings.home.privacy.discordPrecaching')"
      @update:modelValue="$emit('update')"
    ></v-switch>
    <small>
      {{ $t("settings.home.privacy.discordPrecachingDesc") }}
    </small>
    <v-switch
      v-model="$user.changes.publicProfile"
      class="mb-n7"
      :label="$t('settings.home.privacy.publicProfile')"
      @update:modelValue="$emit('update')"
    ></v-switch>
    <small>
      {{ $t("settings.home.privacy.publicProfileDesc") }}
    </small>
    <v-select
      v-model="$user.changes.insights"
      :items="insights"
      :label="$t('settings.home.preferences.insights')"
      class="mb-n2 mt-4"
      @update:modelValue="$emit('update')"
    ></v-select>
    <small>
      {{ $t("settings.home.preferences.insightsDesc") }}
    </small>
    <v-switch
      v-if="$app.site.release === 'dev'"
      v-model="$app.demo"
      class="mb-n7"
      :label="$t('settings.home.privacy.demoMode')"
    ></v-switch>
  </v-card-text>
  <v-card-title>{{ $t("settings.home.myAccount.title") }}</v-card-title>
  <v-expansion-panels class="px-4">
    <v-expansion-panel :title="$t('settings.home.myAccount.changeUsername')">
      <v-expansion-panel-text>
        <v-form v-model="valid.username">
          <v-text-field
            v-model="$user.changes.username"
            :label="$t('settings.home.myAccount.username')"
            :rules="$validation.user.username"
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-model="$user.changes.currentPassword"
            :label="$t('settings.home.myAccount.currentPassword')"
            :rules="$validation.user.passwordSettings"
            class="mt-4"
            type="password"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid.username"
              color="primary"
              @click="
                $user.save().then(() => $emit('update'));
                $toast.success($t('generic.actionCompleted'));
              "
            >
              {{ $t("generic.save") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="$t('settings.home.myAccount.changePassword')">
      <v-expansion-panel-text>
        <v-form v-model="valid.password">
          <v-text-field
            v-model="$user.changes.currentPassword"
            :label="$t('settings.home.myAccount.currentPassword')"
            :rules="$validation.user.passwordSettings"
            class="mt-4"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="$user.changes.password"
            :label="$t('settings.home.myAccount.newPassword')"
            class="mt-4"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :label="$t('settings.home.myAccount.confirmPassword')"
            :rules="[...$validation.user.passwordSettings, ...validation]"
            class="mt-4"
            type="password"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid.password"
              color="primary"
              @click="
                $user.save().then(() => $emit('update'));
                $toast.success($t('generic.actionCompleted'));
              "
            >
              {{ $t("generic.save") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="$t('settings.home.myAccount.changeEmail')">
      <v-expansion-panel-text>
        <v-form v-model="valid.email">
          <p
            class="px-1"
            v-html="
              $t('settings.home.myAccount.emailSet', {
                email: $user.user?.email
              })
            "
          ></p>
          <v-text-field
            v-model="$user.changes.email"
            :label="$t('settings.home.myAccount.email')"
            :rules="$validation.user.email"
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-model="$user.changes.currentPassword"
            :label="$t('settings.home.myAccount.currentPassword')"
            :rules="$validation.user.passwordSettings"
            class="mt-4"
            type="password"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid.email"
              color="primary"
              @click="
                $user.save().then(() => $emit('update'));
                $toast.success($t('generic.actionCompleted'));
              "
            >
              {{ $t("generic.save") }}
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
        <TwoFactor></TwoFactor>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-card-title>{{ $t("settings.home.preferences.title") }}</v-card-title>
  <v-slider
    v-model="$user.changes.itemsPerPage"
    :label="$t('settings.home.preferences.itemsPerPage')"
    class="px-4"
    max="72"
    min="12"
    step="12"
    thumb-label
    @update:modelValue="$emit('update')"
  ></v-slider>
  <!-- select between Farenheit, Celsius or Kelvin -->
  <v-select
    v-model="$user.changes.weatherUnit"
    :items="temperatureUnits"
    :label="$t('settings.home.preferences.tempUnit')"
    class="px-6"
    item-title="title"
    item-value="value"
    @update:modelValue="$emit('update')"
  ></v-select>
  <v-select
    v-model="theme"
    :items="themes"
    :label="$t('settings.home.preferences.theme')"
    class="px-6"
    item-title="title"
    item-value="value"
    @update:modelValue="$emit('update')"
  ></v-select>
  <v-autocomplete
    v-model="$user.changes.excludedCollections"
    :items="$collections.items"
    :label="$t('settings.home.preferences.baseCollections')"
    chips
    class="px-6 mt-4"
    closable-chips
    color="primary"
    item-title="name"
    item-value="id"
    multiple
    variant="underlined"
    @update:modelValue="$emit('update')"
  ></v-autocomplete>
  <v-select
    v-model="$user.changes.language"
    :items="languages"
    :label="$t('settings.home.preferences.language')"
    class="px-6"
    item-title="title"
    item-value="key"
    @update:modelValue="$emit('update')"
  />
  <v-btn
    class="mb-2 ml-5"
    @click="$app.themeEditor = !$app.themeEditor"
    v-if="$user.gold || !$app.site.officialInstance"
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
  ></v-switch>
  <v-switch
    v-if="disableBatterySave"
    v-model="disableBatterySave"
    :label="$t('settings.home.preferences.disableBatteryPreservation')"
    class="px-6 mt-n6"
  ></v-switch>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwoFactor from "@/components/Settings/TwoFactor.vue";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "SettingsHome",
  components: { TwoFactor },
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
      bindings: {
        disableProfileColors: undefined as boolean | undefined
      },
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
        { title: "Everyone", value: "everyone" },
        { title: "Friends", value: "friends" },
        { title: "Nobody", value: "nobody" }
      ],
      confirmPassword: "",
      valid: {
        password: true,
        username: true,
        email: true
      },
      validation: [
        (value: string) => {
          if (value !== this.$user.changes.password)
            return "Passwords do not match";
          return true;
        }
      ]
    };
  },
  computed: {
    disableProfileColors: {
      get() {
        try {
          this.bindings.disableProfileColors;
          return JSON.parse(localStorage.getItem("disableProfileColors")!);
        } catch {
          return false;
        }
      },
      set(val: boolean) {
        this.bindings.disableProfileColors = val;
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
    }
  },
  mounted() {
    this.$app.title = "Settings";
  }
});
</script>

<style scoped></style>
