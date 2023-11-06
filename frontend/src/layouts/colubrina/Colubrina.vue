<template>
  <v-dialog v-model="$chat.dialogs.user.value" max-width="800px">
    <v-card>
      <User
        :key="$chat.dialogs.user.username"
        :username="$chat.dialogs.user.username"
      ></User>
    </v-card>
  </v-dialog>
  <v-menu
    v-model="$chat.dialogs.userMenu.value"
    :activator="'#' + $chat.dialogs.userMenu.bindingElement"
    :close-on-content-click="false"
    location="top"
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
  <router-view></router-view>
  <ColubrinaMemberSidebar
    v-if="!$vuetify.display.mobile"
  ></ColubrinaMemberSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaMemberSidebar from "@/layouts/colubrina/MemberSidebar.vue";
import User from "@/views/User/User.vue";
import ColubrinaUserMenu from "@/components/Communications/Menus/UserMenu.vue";
import ColubrinaImageDialog from "@/components/Communications/Dialogs/Image.vue";
import ColubrinaGroupSettingsDialog from "@/components/Communications/Dialogs/GroupSettingsV2.vue";

export default defineComponent({
  name: "Colubrina",
  components: {
    ColubrinaGroupSettingsDialog,
    ColubrinaImageDialog,
    ColubrinaUserMenu,
    User,
    ColubrinaMemberSidebar
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
