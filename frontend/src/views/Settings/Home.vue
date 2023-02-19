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
            <b>{{ $user.user?.email }}</b>
            .
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
      <v-expansion-panel-title>
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

export default defineComponent({
  name: "SettingsHome",
  components: { TwoFactor },
  emits: ["update", "laoding"],
  data() {
    return {
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
  mounted() {
    this.$app.title = "Settings";
  }
});
</script>

<style scoped></style>
