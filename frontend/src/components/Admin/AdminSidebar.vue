<template>
  <CoreSidebar name="admin" color="dark" floating permanent>
    <div class="rounded-0 access-level pb-1 pt-2 pl-2" height="20">
      Your access:
      {{
        $user.user?.administrator
          ? "High level"
          : $user.user?.moderator
          ? "Low level"
          : "Get out!1111"
      }}
    </div>
    <AdminSidebarList />
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AdminSidebarList from "@/components/Admin/AdminSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "AdminSidebar",
  components: { CoreSidebar, AdminSidebarList }
});
</script>

<style scoped>
.access-level {
  background-image: -webkit-radial-gradient(
    rgba(1, 144, 234, 0.5),
    rgba(1, 121, 243, 0.5)
  );
  opacity: 0.95;
}
</style>
