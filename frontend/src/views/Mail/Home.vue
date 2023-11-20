<template>
  <v-container />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    this.$app.title = "Mail";
  }
});
</script>
