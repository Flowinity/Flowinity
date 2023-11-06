<template>
  <CoreSidebar
    name="chat-members"
    v-model="$chat.memberSidebarShown"
    :class="
      $chat.memberSidebarShown &&
      !$chat.memberSidebar &&
      !$vuetify.display.mobile
        ? 'sidebar-patch'
        : ''
    "
    :width="$chat.search.value ? 400 : undefined"
    color="dark"
    floating
    location="right"
  >
    <member-sidebar-list></member-sidebar-list>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebar",
  components: { CoreSidebar, MemberSidebarList }
});
</script>

<style scoped></style>
