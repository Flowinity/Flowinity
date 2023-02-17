<template>
  <v-container class="text-center justify-center">
    <PromoNoContent
      title="TPU Communications"
      icon="mdi-message-processing-outline"
      description="Chat with other TPU & Colubrina users."
    ></PromoNoContent>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";

export default defineComponent({
  name: "Communications" + "Home",
  components: { PromoNoContent }
});
</script>

<style scoped></style>
