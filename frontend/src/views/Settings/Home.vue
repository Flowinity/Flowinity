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
  <v-card-title>Preferences</v-card-title>
  <v-slider
    v-model="$user.changes.itemsPerPage"
    max="72"
    min="12"
    step="12"
    thumb-label
    label="Items per page"
    class="px-4"
    @update:modelValue="$emit('update')"
  ></v-slider>
  <!-- select between Farenheit, Celsius or Kelvin -->
  <v-select
    v-model="$user.changes.weatherUnit"
    :items="temperatureUnits"
    label="Temperature unit for weather widget"
    class="px-6"
    @update:modelValue="$emit('update')"
    item-title="title"
    item-value="value"
  ></v-select>
  <v-select
    v-model="theme"
    :items="themes"
    label="Theme"
    class="px-6"
    @update:modelValue="$emit('update')"
    item-title="title"
    item-value="value"
  ></v-select>
  <v-select
    class="px-6 mb-n4"
    v-model="$user.changes.insights"
    :items="insights"
    label="Who can see your insights*"
    @update:modelValue="$emit('update')"
  ></v-select>
  <small class="px-6 text-grey">
    * Words in screenshots and top chats are always hidden.
  </small>
  <br />
  <v-btn class="px-6 mt-3" @click="$app.themeEditor = !$app.themeEditor">
    <v-icon class="mr-2">mdi-palette</v-icon>
    <span>
      Open Theme Editor
      <v-chip size="x-small">NEW</v-chip>
    </span>
  </v-btn>
  <v-switch
    v-model="disableProfileColors"
    label="Disable profile colors"
    class="px-4"
  ></v-switch>
  <v-card-title>My TPU</v-card-title>
  <v-expansion-panels class="px-4">
    <v-expansion-panel title="Change username">
      <v-expansion-panel-text>
        <v-form v-model="valid.username">
          <v-text-field
            class="mt-4"
            label="Username"
            :rules="$validation.user.username"
            v-model="$user.changes.username"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            label="Current password"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid.username"
              color="primary"
              @click="$user.save().then(() => $emit('update'))"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Change password">
      <v-expansion-panel-text>
        <v-form v-model="valid.password">
          <v-text-field
            class="mt-4"
            label="Current password"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            label="New password"
            type="password"
            v-model="$user.changes.password"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            label="Confirm new password"
            type="password"
            :rules="[...$validation.user.passwordSettings, ...validation]"
            v-model="confirmPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid.password"
              @click="$user.save().then(() => $emit('update'))"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Change email">
      <v-expansion-panel-text>
        <v-form v-model="valid.email">
          <p class="px-1">
            Your email is currently set to
            <b>{{ $user.user?.email }}.</b>
          </p>
          <v-text-field
            class="mt-4"
            label="Email"
            :rules="$validation.user.email"
            v-model="$user.changes.email"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            label="Current password"
            type="password"
            :rules="$validation.user.passwordSettings"
            v-model="$user.changes.currentPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid.email"
              color="primary"
              @click="$user.save().then(() => $emit('update'))"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title class="bg-card">
        Two factor authentication (2FA)
        <v-chip
          v-if="$user.user?.totpEnable"
          color="green"
          label
          size="small"
          class="ml-2"
        >
          Enabled
        </v-chip>
        <v-chip v-else color="error" label size="small" class="ml-2">
          Disabled
        </v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text><TwoFactor></TwoFactor></v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
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
