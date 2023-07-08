<template>
  <v-navigation-drawer
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
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ColubrinaMemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebar",
  components: {ColubrinaMemberSidebarList}
});
</script>

<style scoped></style>
