<template>
  <AdminSidebar />
  <router-view />
</template>

<script lang="ts">
import AdminSidebar from "@/components/Admin/AdminSidebar.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Admin",
  components: { AdminSidebar }
});
</script>
