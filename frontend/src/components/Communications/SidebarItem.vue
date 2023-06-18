<template>
  <div
    class="member-sidebar-item unselectable"
    @click="handleClick"
    :class="{ pointer: !legacyUser, selected: isSelected }"
  >
    <UserAvatar
      :user="user"
      :status="!!user"
      :dot-status="!!user"
      :chat="chat"
    ></UserAvatar>
    <div class="ml-2">
      <span class="limit" v-if="user">
        {{
          legacyUser
            ? user.username
            : $friends.getName(user.id) || user.username
        }}
        <span v-if="rank === 'owner'">
          <v-icon color="gold">mdi-crown</v-icon>
          <v-tooltip :eager="false" activator="parent" location="top">
            Owner
          </v-tooltip>
        </span>

        <span v-else-if="rank === 'admin'">
          <v-icon color="grey">mdi-crown</v-icon>
          <v-tooltip :eager="false" activator="parent" location="top">
            Administrator
          </v-tooltip>
        </span>
      </span>
      <span class="limit" v-else-if="chat">
        {{ chat.name }}
      </span>
      <p class="text-subtitle-2 mt-n1 text-grey" v-if="legacyUser">
        Legacy user
      </p>
      <p class="text-subtitle-2 mt-n1 text-grey" v-else-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";

export default defineComponent({
  name: "SidebarItem",
  components: { UserAvatar },
  props: {
    user: {
      type: Object as () => User,
      required: false
    },
    rank: {
      type: String,
      required: false
    },
    legacyUser: {
      type: Boolean,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    chat: {
      type: Object as () => Chat,
      required: false
    }
  },
  methods: {
    handleClick() {
      if (this.legacyUser) return;
      if (this.chat) {
        this.$router.push(`/communications/${this.chat.association.id}`);
      } else {
        this.$chat.dialogs.user.username = this.user.username;
        this.$chat.dialogs.user.value = true;
      }
    }
  },
  computed: {
    isSelected() {
      if (this.chat) {
        return (
          this.$route.params.chatId === this.chat.association.id.toString()
        );
      } else {
        return false;
      }
    }
  }
});
</script>

<style scoped></style>
