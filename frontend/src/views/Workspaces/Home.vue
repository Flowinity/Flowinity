<template>
  <v-container>
    <PromoNoContent title="Workspaces"></PromoNoContent>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";

export default defineComponent({
  name: "Home",
  components: { PromoNoContent }
});
</script>

<style scoped></style>
