<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TPUApp",
  watch: {
    "$app.title"(val) {
      document.title = val + " - TPUvNEXT";
    }
  }
});
</script>
