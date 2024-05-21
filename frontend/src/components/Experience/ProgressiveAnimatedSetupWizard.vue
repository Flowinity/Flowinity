<template>
  <v-tooltip
    v-if="step === Step.SUPERBAR"
    location-strategy="static"
    location="bottom"
    :model-value="true"
    attach="#superbar-1"
    :close-on-content-click="false"
    :close-on-back="false"
    :offset="[10, 0]"
  >
    test
  </v-tooltip>
</template>

<script lang="ts" setup>
import { ref } from "vue";

enum Step {
  SUPERBAR,
  SIDEBAR,
  ACTIONBAR
}

const step = ref<Step>(Step.SUPERBAR);
</script>

<style scoped></style>
