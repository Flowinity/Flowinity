<template>
  <v-container></v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  mounted() {
    this.$app.title = "Mail";
  }
});
</script>

<style scoped></style>
