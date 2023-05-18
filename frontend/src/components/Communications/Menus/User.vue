<template>
  <v-card
    v-if="user"
    class="justify-center text-center"
    style="position: relative"
    width="300"
  >
    <UserBanner :user="user" height="90"></UserBanner>
    <v-card-text class="ml-n2 center" style="position: relative">
      <UserAvatar
        :no-badges="true"
        :outline="true"
        :status="true"
        :user="user"
        class="avatar"
        size="100"
      >
        <div style="cursor: pointer" @click="expand">
          <v-overlay :model-value="true" contained persistent @click="expand">
            <v-icon large>mdi-expand</v-icon>
          </v-overlay>
        </div>
      </UserAvatar>
      <h1 class="mt-12 mb-4" style="font-weight: 500">
        {{ user.username }}
      </h1>
      <UserBadges :user="user" class="justify-center"></UserBadges>
      <template v-if="user.description">
        <v-divider class="mt-1 mb-n1"></v-divider>
        <v-card-text class="text-overline">
          About {{ user.username }}
        </v-card-text>
        <v-card-text
          class="text-body-2 mt-n6"
          style="overflow-wrap: break-word; white-space: pre-line"
        >
          {{ user.description }}
        </v-card-text>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "ColubrinaUserMenu",
  components: { UserAvatar, UserBadges, UserBanner },
  computed: {
    user() {
      if (this.$chat.dialogs.userMenu.user?.id === this.$user.user?.id)
        return this.$user.user;
      return (
        this.$friends.friends.find(
          (friend) =>
            friend.otherUser.username === this.$chat.dialogs.userMenu.username
        )?.otherUser || this.$chat.dialogs.userMenu.user
      );
    }
  },
  methods: {
    expand() {
      this.$chat.dialogs.user.username = this.$chat.dialogs.userMenu.username;
      this.$chat.dialogs.user.value = true;
      this.$chat.dialogs.userMenu.value = false;
    }
  }
});
</script>

<style scoped>
.avatar {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
