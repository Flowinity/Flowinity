<template>
  <v-navigation-drawer permanent color="dark" floating>
    <ColubrinaSidebarList></ColubrinaSidebarList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebarList from "@/layouts/colubrina/SidebarList.vue";

export default defineComponent({
  name: "ColubrinaSidebar",
  components: { ColubrinaSidebarList }
});
</script>

<style scoped></style>
