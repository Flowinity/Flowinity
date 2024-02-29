<template>
  <v-text-field
    v-if="passwordMode || !$user.user.totpEnable || both"
    autofocus
    :model-value="password"
    type="password"
    :label="$t('settings.home.myAccount.currentPassword')"
    @update:model-value="$emit('update:password', $event)"
    @keydown.enter="$emit('confirm')"
  >
    <template v-if="$user.user.totpEnable && !both" #details>
      Having problems?
      <a
        class="unselectable pointer"
        @click="$emit('update:passwordMode', false)"
      >
        &nbsp;Use your 2FA code instead.
      </a>
    </template>
  </v-text-field>
  <v-text-field
    v-if="
      ($user.user.totpEnable && !passwordMode) ||
      (both && $user.user.totpEnable)
    "
    :label="$t('settings.home.totp.code')"
    :model-value="totp"
    autofocus
    @update:model-value="$emit('update:totp', $event)"
    @keydown.enter="$emit('confirm')"
  >
    <template v-if="!both" #details>
      Having problems?
      <a
        class="unselectable pointer"
        @click="$emit('update:passwordMode', true)"
      >
        &nbsp;Use your password instead.
      </a>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DangerZoneInput",
  props: ["passwordMode", "password", "totp", "both"],
  emits: ["update:passwordMode", "update:password", "update:totp", "confirm"],
  mounted() {
    if (!this.$user.user?.totpEnable) {
      this.$emit("update:passwordMode", true);
    }
  }
});
</script>
