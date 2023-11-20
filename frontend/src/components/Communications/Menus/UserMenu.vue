<template>
  <v-card
    class="justify-center text-center"
    style="position: relative"
    width="300"
  >
    <UserBanner :user="user" height="90">
      <template v-slot:default="{ hovering }">
        <div style="cursor: pointer" @click="expand">
          <v-overlay
            :model-value="hovering"
            :contained="true"
            :persistent="true"
            @click="expand"
            class="align-center justify-center"
            content-class="force-bg"
          >
            <v-icon size="large" class="mb-6">mdi-arrow-expand-all</v-icon>
          </v-overlay>
        </div>
      </template>
    </UserBanner>
    <v-card-text style="position: relative">
      <user-avatar
        :no-badges="true"
        :outline="true"
        :status="true"
        :user="user"
        class="avatar"
        size="100"
      >
        <template v-slot:default="{ hovering }">
          <div style="cursor: pointer" @click="expand">
            <v-overlay
              :model-value="hovering"
              :contained="true"
              :persistent="true"
              @click="expand"
              class="align-center justify-center"
              content-class="force-bg"
            >
              <v-icon size="large">mdi-arrow-expand-all</v-icon>
            </v-overlay>
          </div>
        </template>
      </user-avatar>
      <h1 class="mt-n9 mb-4" style="font-weight: 500">
        {{ user.username }}
      </h1>

      <v-slide-group>
        <v-slide-group-item>
          <user-badges :user="user" class="justify-center" />
        </v-slide-group-item>
      </v-slide-group>
      <template v-if="user.description">
        <overline>About {{ user.username }}</overline>
        <p style="overflow-wrap: break-word; white-space: pre-line">
          {{ user.description }}
        </p>
      </template>
      <overline>Ranks in {{ $chat.selectedChat?.name }}</overline>
      <div class="flex" v-if="$chat.selectedChat && association">
        <add-role
          :ranks="$chat.selectedChat.ranks"
          :association="association"
          size="small"
          :chat="$chat.selectedChat"
          :current-association-id="$chat.selectedChat.association.id"
        />
        <v-chip
          v-for="rank in association?.ranks"
          :key="rank.id"
          :color="rank.color"
          class="ml-1 my-1"
          size="small"
        >
          {{ rank.name }}
          <v-icon
            class="pointer ml-1"
            @click="
              $chat.toggleUserRank(
                association.id,
                $chat.selectedChat.association.id,
                rank.id
              )
            "
            size="20"
            v-if="
              !rank.managed && $chat.canEditRank(rank.index, $chat.selectedChat)
            "
          >
            mdi-close
          </v-icon>
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import AddRole from "@/components/Communications/Menus/AddRole.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  components: { Overline, AddRole, UserAvatar, UserBadges, UserBanner },
  computed: {
    user() {
      return this.$chat.dialogs.userMenu.user;
    },
    association() {
      const assoc = this.$chat.selectedChat?.users.find(
        (user) => user.userId === this.user.id
      );
      if (assoc)
        assoc.ranks = assoc?.ranksMap.map((rank) => {
          return this.$chat.selectedChat.ranks.find((r) => {
            return r.id === rank;
          });
        });
      return assoc;
    }
  },
  methods: {
    expand() {
      this.$chat.dialogs.user.username =
        this.$chat.dialogs.userMenu.user.username;
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
  transform: translateX(-50%);
}
</style>
