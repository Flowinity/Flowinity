<template>
  <v-navigation-drawer v-model="$mail.drawer" permanent color="dark" floating>
    <MailSidebarList></MailSidebarList>
    <template v-slot:append>
      <v-btn block>
        <v-icon class="mr-1">mdi-pencil</v-icon>
        Compose
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MailSidebarList from "@/layouts/mail/SidebarList.vue";

export default defineComponent({
  name: "MailSidebar",
  components: { MailSidebarList }
});
</script>

<style scoped></style>
