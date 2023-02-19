<template>
  <v-navigation-drawer permanent color="dark" floating>
    <ColubrinaSidebarList></ColubrinaSidebarList>
    <template v-slot:append><StatusSwitcher></StatusSwitcher></template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebarList from "@/layouts/colubrina/SidebarList.vue";
import StatusSwitcher from "@/components/Communications/StatusSwitcher.vue";

export default defineComponent({
  name: "ColubrinaSidebar",
  components: { StatusSwitcher, ColubrinaSidebarList }
});
</script>

<style scoped></style>
