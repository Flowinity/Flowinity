<template>
  <v-container>
    <v-card class="text-center">
      <p style="font-size: 69px" class="mb-n5">404</p>
      <v-card-text>The page you are looking for does not exist.</v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
  mounted() {
    this.$app.title = "Not Found";
  }
});
</script>

<style scoped></style>
