<template>
  <div
    :class="{ pointer: chat || !legacyUser, selected: isSelected }"
    class="member-sidebar-item unselectable"
    @click="handleClick"
  >
    <UserAvatar
      :chat="chat"
      :dot-status="!!user"
      :status="!!user"
      :user="user"
    ></UserAvatar>
    <div class="ml-2">
      <span v-if="user" class="limit">
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
      <span v-else-if="chat" class="limit">
        {{ chat.name }}
      </span>
      <p v-if="legacyUser" class="text-subtitle-2 mt-n1 text-grey">
        Legacy user
      </p>
      <p v-else-if="subtitle" class="text-subtitle-2 mt-n1 text-grey">
        {{ subtitle }}
      </p>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import {User} from "@/models/user";
import {Chat} from "@/models/chat";

export default defineComponent({
  name: "SidebarItem",
  components: {UserAvatar},
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
      if (this.chat) {
        this.$router.push(`/communications/${this.chat.association.id}`);
      } else if (!this.legacyUser) {
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
