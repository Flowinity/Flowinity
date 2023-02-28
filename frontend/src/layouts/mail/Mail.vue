<template>
  <MailSidebar></MailSidebar>
  <MailboxSidebar></MailboxSidebar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MailSidebar from "@/layouts/mail/Sidebar.vue";
import MailboxSidebar from "@/layouts/mail/MailboxSidebar.vue";

export default defineComponent({
  name: "Mail",
  components: { MailboxSidebar, MailSidebar }
});
</script>

<style scoped></style>
