<template>
  <ColubrinaSidebar></ColubrinaSidebar><router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebar from "@/layouts/colubrina/Sidebar.vue";

export default defineComponent({
  name: "Colubrina",
  components: { ColubrinaSidebar }
});
</script>

<style scoped></style>
