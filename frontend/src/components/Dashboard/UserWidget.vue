<template>
  <v-card class="text-center justify-center">
    <v-container>
      <UserAvatar :user="$user.user" :size="92"></UserAvatar>
      <v-card-title class="text-h4 mb-1">
        {{ $user.user?.username }}
      </v-card-title>
      <UserBadges class="justify-center" :user="$user.user"></UserBadges>
      <v-divider class="mt-3 mb-3"></v-divider>
      {{ $user.user?.description }}
    </v-container>
  </v-card>
</template>

<script lang="ts">
import UserAvatar from "@/components/Users/UserAvatar.vue";
import UserBadges from "@/components/Users/UserBadges.vue";

export default {
  name: "UserWidget",
  components: { UserBadges, UserAvatar }
};
</script>

<style scoped></style>
