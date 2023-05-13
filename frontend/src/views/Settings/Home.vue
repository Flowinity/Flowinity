<template>
  <v-card-title>Privacy</v-card-title>
  <v-card-text>
    <v-switch
      v-model="$user.changes.discordPrecache"
      label="Discord precaching"
      class="mb-n7"
      @update:modelValue="$emit('update')"
    ></v-switch>
    <small>
      * Discord precaching sends the TPU link of any media attachment to a
      Discord channel that gets cleared every 10 minutes in order to have the
      image cached by Discord by the time it's sent by yourself. Do not enable
      this if you don't trust Discord.
    </small>
    <v-switch
      v-model="$app.demo"
      label="Demo mode"
      class="mb-n7"
      v-if="$app.site.release === 'dev'"
    ></v-switch>
  </v-card-text>
  <v-card-title>{{ $t("settings.home.myAccount.title") }}</v-card-title>
  <v-expansion-panels class="px-4">
    <v-expansion-panel :title="$t('settings.home.myAccount.changeUsername')">
      <v-expansion-panel-text>
        <v-form v-model="valid.username">
          <v-text-field
            class="mt-4"
            :label="$t('settings.home.myAccount.username')"
            :rules="$validation.user.username"
            v-model="$user.changes.username"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            :label="$t('settings.home.myAccount.currentPassword')"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
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
            class="mt-4"
            :label="$t('settings.home.myAccount.currentPassword')"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            :label="$t('settings.home.myAccount.newPassword')"
            type="password"
            v-model="$user.changes.password"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            :label="$t('settings.home.myAccount.confirmPassword')"
            type="password"
            :rules="[...$validation.user.passwordSettings, ...validation]"
            v-model="confirmPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid.password"
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
            class="mt-4"
            :label="$t('settings.home.myAccount.email')"
            :rules="$validation.user.email"
            v-model="$user.changes.email"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            :label="$t('settings.home.myAccount.currentPassword')"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
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
          color="green"
          label
          size="small"
          class="ml-2"
        >
          {{ $t("generic.enabled") }}
        </v-chip>
        <v-chip v-else color="error" label size="small" class="ml-2">
          {{ $t("generic.disabled") }}
        </v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text><TwoFactor></TwoFactor></v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-card-title>{{ $t("settings.home.preferences.title") }}</v-card-title>
  <v-slider
    v-model="$user.changes.itemsPerPage"
    max="72"
    min="12"
    step="12"
    thumb-label
    :label="$t('settings.home.preferences.itemsPerPage')"
    class="px-4"
    @update:modelValue="$emit('update')"
  ></v-slider>
  <!-- select between Farenheit, Celsius or Kelvin -->
  <v-select
    v-model="$user.changes.weatherUnit"
    :items="temperatureUnits"
    :label="$t('settings.home.preferences.tempUnit')"
    class="px-6"
    @update:modelValue="$emit('update')"
    item-title="title"
    item-value="value"
  ></v-select>
  <v-select
    v-model="theme"
    :items="themes"
    :label="$t('settings.home.preferences.theme')"
    class="px-6"
    @update:modelValue="$emit('update')"
    item-title="title"
    item-value="value"
  ></v-select>
  <v-select
    class="px-6 mb-n4"
    v-model="$user.changes.insights"
    :items="insights"
    :label="$t('settings.home.preferences.insights')"
    @update:modelValue="$emit('update')"
  ></v-select>
  <small class="px-6 text-grey">
    {{ $t("settings.home.preferences.insightsDesc") }}
  </small>
  <v-autocomplete
    class="px-6 mt-4"
    v-model="$user.changes.excludedCollections"
    :items="$collections.items"
    multiple
    item-title="name"
    item-value="id"
    :label="$t('settings.home.preferences.baseCollections')"
    @update:modelValue="$emit('update')"
    variant="underlined"
    color="primary"
    closable-chips
    chips
  ></v-autocomplete>
  <v-select
    class="px-6"
    v-model="$user.changes.language"
    :items="languages"
    :label="$t('settings.home.preferences.language')"
    @update:modelValue="$emit('update')"
    item-title="title"
    item-value="key"
  >
    <template v-slot:item="{ item }">
      <v-list-item
        :active="$user.changes.language === item.value"
        @click="$user.changes.language = item.value"
        v-if="item.value !== 'help'"
      >
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item :href="<string>item.raw.link" v-if="item.value === 'help'">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
  <br />
  <v-btn class="px-6" @click="$app.themeEditor = !$app.themeEditor">
    <v-icon class="mr-2">mdi-palette</v-icon>
    <span>
      {{ $t("settings.home.preferences.themeEditor") }}
      <v-chip size="x-small">{{ $t("generic.new") }}</v-chip>
    </span>
  </v-btn>
  <v-switch
    v-model="disableProfileColors"
    :label="$t('settings.home.preferences.disableProfileColors')"
    class="px-4"
  ></v-switch>
  <v-switch
    v-model="disableBatterySave"
    :label="$t('settings.home.preferences.disableBatteryPreservation')"
    class="px-4 mt-n6"
    v-if="disableBatterySave"
  ></v-switch>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwoFactor from "@/components/Settings/TwoFactor.vue";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "SettingsHome",
  components: { TwoFactor },
  emits: ["update", "laoding"],
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
          title: "Help localize TPU",
          key: "help",
          link: "https://github.com/PrivateUploader/PrivateUploader/tree/main/frontend/src/locales"
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
