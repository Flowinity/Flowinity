<template>
  <v-navigation-drawer
    color="dark"
    floating
    location="right"
    v-model="$chat.memberSidebarShown"
    :class="
      !$chat.memberSidebar && !$vuetify.display.mobile ? 'sidebar-patch' : ''
    "
  >
    <ColubrinaMemberSidebarList></ColubrinaMemberSidebarList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaMemberSidebarList from "@/layouts/colubrina/MemberSidebarList.vue";

export default defineComponent({
  name: "ColubrinaMemberSidebar",
  components: { ColubrinaMemberSidebarList }
});
</script>

<style scoped></style>
