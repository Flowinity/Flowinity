<template>
  <v-dialog v-model="$chat.dialogs.user.value" style="max-width: 75vw">
    <v-card>
      <user
        :key="$chat.dialogs.user.username"
        :username="$chat.dialogs.user.username"
      ></user>
    </v-card>
  </v-dialog>
  <v-menu
    v-model="$chat.dialogs.userMenu.value"
    :activator="'#' + $chat.dialogs.userMenu.bindingElement"
    :close-on-content-click="false"
    location="top"
    style="z-index: 2001"
  >
    <user-menu></user-menu>
  </v-menu>
  <image-dialog v-model="$chat.dialogs.image.value"></image-dialog>
  <group-settings-dialog
    v-model="$chat.dialogs.groupSettings.value"
  ></group-settings-dialog>
  <router-view></router-view>
  <member-sidebar v-if="!$vuetify.display.mobile"></member-sidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MemberSidebar from "@/layouts/colubrina/MemberSidebar.vue";
import User from "@/views/User/User.vue";
import UserMenu from "@/components/Communications/Menus/UserMenu.vue";
import ImageDialog from "@/components/Communications/Dialogs/Image.vue";
import GroupSettingsDialog from "@/components/Communications/Dialogs/GroupSettingsV2.vue";

export default defineComponent({
  name: "Colubrina",
  components: {
    GroupSettingsDialog,
    ImageDialog,
    MemberSidebar,
    UserMenu,
    User
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
