<template>
  <core-sidebar
    :model-value="$chat.memberSidebarShown || $app.rail"
    name="chat-members"
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
    class="user-content"
    @update:model-value="$chat.memberSidebarShown = $event"
  >
    <member-sidebar-list />
  </core-sidebar>
</template>

<script setup lang="ts">
import MemberSidebarList from "@/layouts/communications/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";
</script>
