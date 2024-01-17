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
    @update:model-value="$chat.memberSidebarShown = $event"
  >
    <member-sidebar-list />
  </core-sidebar>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import MemberSidebarList from "@/layouts/communications/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  components: { CoreSidebar, MemberSidebarList }
});
</script>
