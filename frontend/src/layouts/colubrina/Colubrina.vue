<template>
  <v-dialog max-width="800px" v-model="$chat.dialogs.user.value">
    <v-card>
      <User
        :username="$chat.dialogs.user.username"
        :key="$chat.dialogs.user.username"
      ></User>
    </v-card>
  </v-dialog>
  <ColubrinaSidebar v-if="$chat.communicationsSidebar"></ColubrinaSidebar
  ><router-view></router-view
  ><ColubrinaMemberSidebar
    v-if="$chat.selectedChat?.type === 'group'"
  ></ColubrinaMemberSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebar from "@/layouts/colubrina/Sidebar.vue";
import ColubrinaMemberSidebar from "@/layouts/colubrina/MemberSidebar.vue";
import User from "@/views/User/User.vue";

export default defineComponent({
  name: "Colubrina",
  components: { User, ColubrinaMemberSidebar, ColubrinaSidebar }
});
</script>

<style scoped></style>
