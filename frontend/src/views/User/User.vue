<template>
  <UserV3 :username="username" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserV3 from "@/views/User/UserV3.vue";

export default defineComponent({
  components: { UserV3 },
  props: ["username"]
});
</script>
