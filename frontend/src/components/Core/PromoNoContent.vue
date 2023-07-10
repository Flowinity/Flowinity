<template>
  <div class="text-center justify-center unselectable">
    <v-icon class="text-grey" size="120">{{ icon }}</v-icon>
    <h1 style="opacity: 0.7">{{ title }}</h1>
    <p style="opacity: 0.7">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PromoNoContent",
  props: ["icon", "title", "description"]
});
</script>

<style scoped></style>
