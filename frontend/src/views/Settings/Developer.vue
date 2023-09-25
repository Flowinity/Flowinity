<template>
  <AdminOAuth />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AdminOAuth from "@/views/Admin/Oauth.vue";

export default defineComponent({
  name: "Developer",
  components: { AdminOAuth }
});
</script>

<style scoped></style>
