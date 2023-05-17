<template>
  <v-container>
    <Domains></Domains>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Domains from "@/views/Settings/Domains.vue";

export default defineComponent({
  name: "AdminDomains",
  components: { Domains }
});
</script>

<style scoped></style>
