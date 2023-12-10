<template>
  <CoreSidebar
    v-model="$mail.drawer"
    name="mail"
    color="dark"
    floating
    permanent
  >
    <MailSidebarList />
    <template #append>
      <v-btn block>
        <v-icon class="mr-1">mdi-pencil</v-icon>
        Compose
      </v-btn>
    </template>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MailSidebarList from "@/layouts/mail/SidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "MailSidebar",
  components: { CoreSidebar, MailSidebarList }
});
</script>
