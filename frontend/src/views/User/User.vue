<template>
  <UserV3 :username="username" v-if="$experiments.experiments.USER_V3"></UserV3>
  <UserV2 :username="username" v-else></UserV2>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserV3 from "@/views/User/UserV3.vue";
import UserV2 from "@/views/User/UserV2.vue";

export default defineComponent({
  name: "User",
  components: { UserV2, UserV3 },
  props: ["username"]
});
</script>
