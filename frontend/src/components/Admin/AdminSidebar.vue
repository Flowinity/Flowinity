<template>
  <v-navigation-drawer permanent color="dark" floating>
    <AdminSidebarList></AdminSidebarList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AdminSidebarList from "@/components/Admin/AdminSidebarList.vue";

export default defineComponent({
  name: "AdminSidebar",
  components: { AdminSidebarList }
});
</script>

<style scoped></style>
