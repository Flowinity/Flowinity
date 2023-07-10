<template>
  <v-card-text class="text-overline">Mutual Friends</v-card-text>
  <v-card-text class="subtitle-1 mt-n6">
    <v-slide-group>
      <v-card
        v-for="friend in user.friends"
        :key="friend.id"
        :to="!username ? `/u/${friend.user.username}` : undefined"
        class="rounded-xl pt-3 justify-center text-center px-2 no-border"
        color="transparent"
        elevation="0"
        @click="
          username ? ($chat.dialogs.user.username = friend.user.username) : null
        "
      >
        <UserAvatar
          :no-badges="true"
          :status="true"
          :user="friend.user"
          class="ml-2 mr-2"
          size="100"
        />
        <v-card-title class="text-center justify-center">
          {{ friend.user.username }}
        </v-card-title>
      </v-card>
    </v-slide-group>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "MutualFriends",
  components: { UserAvatar },
  props: ["user", "username"]
});
</script>

<style scoped></style>
