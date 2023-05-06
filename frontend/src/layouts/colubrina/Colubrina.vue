<template>
  <v-dialog max-width="800px" v-model="$chat.dialogs.user.value">
    <v-card>
      <User
        :username="$chat.dialogs.user.username"
        :key="$chat.dialogs.user.username"
      ></User>
    </v-card>
  </v-dialog>
  <v-menu
    v-model="$chat.dialogs.userMenu.value"
    location="top"
    :close-on-content-click="false"
    :activator="'#' + $chat.dialogs.userMenu.bindingElement"
    style="z-index: 2001"
  >
    <ColubrinaUserMenu></ColubrinaUserMenu>
  </v-menu>
  <ColubrinaImageDialog
    v-model="$chat.dialogs.image.value"
  ></ColubrinaImageDialog>
  <ColubrinaGroupSettingsDialog
    v-model="$chat.dialogs.groupSettings.value"
  ></ColubrinaGroupSettingsDialog>
  <ColubrinaSidebar v-if="$chat.communicationsSidebar"></ColubrinaSidebar>
  <router-view></router-view>
  <ColubrinaMemberSidebar></ColubrinaMemberSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebar from "@/layouts/colubrina/Sidebar.vue";
import ColubrinaMemberSidebar from "@/layouts/colubrina/MemberSidebar.vue";
import User from "@/views/User/User.vue";
import ColubrinaUserMenu from "@/components/Communications/Menus/User.vue";
import ColubrinaImageDialog from "@/components/Communications/Dialogs/Image.vue";
import ColubrinaGroupSettingsDialog from "@/components/Communications/Dialogs/GroupSettings.vue";

export default defineComponent({
  name: "Colubrina",
  components: {
    ColubrinaGroupSettingsDialog,
    ColubrinaImageDialog,
    ColubrinaUserMenu,
    User,
    ColubrinaMemberSidebar,
    ColubrinaSidebar
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.$chat.dialogs.userMenu.y - 150}px;
        left: ${this.$chat.dialogs.userMenu.x + 10}px;`;
    }
  }
});
</script>

<style scoped></style>
