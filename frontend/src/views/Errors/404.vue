<template>
  <v-container>
    <v-card class="text-center">
      <p class="mb-n5" style="font-size: 69px">404</p>
      <v-card-text>{{ $t("errors.notFound") }}</v-card-text>
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
