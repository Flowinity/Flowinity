<template>
  <v-alert type="success" v-if="$user.user?.totpEnable" variant="tonal">
    You have 2FA enabled.
  </v-alert>
  <v-alert type="error" v-else variant="tonal">
    You do not have 2FA enabled.
  </v-alert>
  <v-card-text>Coming soon</v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TwoFactor"
});
</script>

<style scoped></style>
