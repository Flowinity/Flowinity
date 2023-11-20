<template>
  <UserV3
    v-if="$experiments.experiments.USER_V3 && !$route.query.forceV2"
    :username="username"
  />
  <div v-else>UserV2 no longer available.</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserV3 from "@/views/User/UserV3.vue";

export default defineComponent({
  name: "User",
  components: { UserV3 },
  props: ["username"]
});
</script>
