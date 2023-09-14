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
    <ColubrinaMemberSidebarList></ColubrinaMemberSidebarList>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaMemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebar",
  components: { CoreSidebar, ColubrinaMemberSidebarList }
});
</script>

<style scoped></style>
