<template>
  <button
    type="button"
    class="v-btn v-btn--icon v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
  >
    <span class="v-btn__content">
      <i
        :class="`${icon} mdi v-icon notranslate v-icon--size-default`"
        aria-hidden="true"
      ></i>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MinimalButton",
  props: ["icon"]
});
</script>
