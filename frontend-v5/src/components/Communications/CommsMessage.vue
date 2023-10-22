<template>
  <div class="flex-col items-center">
    <message-reply :reply="message.reply" class="ml-9 items-center mt-2" />
    <div
      v-bind="$attrs"
      class="message hover-message-actions flex"
      :class="{
        'mt-2': !merge && !message.reply,
        'mt-1': message.reply
      }"
      :ref="`message-${message.id}`"
      @mouseenter="hovered = true"
    >
      <div class="flex flex-grow basis-0 message-main relative rounded-l">
        <div class="avatar-section" :class="{ 'justify-center': merge }">
          <UserAvatar
            :user-id="message.userId || 0"
            :username="message.user?.username"
            v-if="!merge"
          />
          <p
            style="font-size: 10px"
            class="text-medium-emphasis-dark merge-date"
            v-else
          >
            {{ $date(message.createdAt).format("hh:mm A") }}
          </p>
        </div>
        <div class="flex-col">
          <div class="flex items-center" v-if="!merge">
            {{ friendsStore.getName(message.userId) }}
            <p class="text-medium-emphasis-dark text-sm ml-2">
              {{ dayjs(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
            </p>
          </div>
          <div class="relative inline-block">
            <span
              class="overflow-content"
              v-html="$functions.markdown(message.content || '', message)"
              :class="{
                'text-medium-emphasis-dark': message.pending,
                'text-red': message.error
              }"
              v-memo="[message.content, message.error, message.pending]"
            ></span>
          </div>
        </div>
        <comms-message-actions
          @reply="$emit('reply', message.id)"
          v-if="hovered"
        ></comms-message-actions>
      </div>
      <div
        class="flex-shrink-1 justify-end align-bottom relative align-self-end h-full flex flex-col items-end"
        v-if="!search"
        style="width: 100px; height: 100%"
      >
        <div
          class="flex align-bottom h-100"
          :class="{ 'read-receipt-avatars': message.readReceipts.length > 3 }"
        >
          <user-avatar
            v-for="(readReceipt, index) in message.readReceipts"
            :user-id="readReceipt.userId || 0"
            :key="readReceipt.id"
            :class="{ 'ml-1': message.readReceipts.length <= 3 }"
            size="22"
            class="read-receipt-avatar"
            v-tooltip="userStore.users[readReceipt.userId || 0]?.username"
          ></user-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "@/gql/graphql";
import UserAvatar from "@/components/User/UserAvatar.vue";
import ReplyLine from "@/components/Communications/ReplyLine.vue";
import { useUserStore } from "@/stores/user.store";
import { useFriendsStore } from "@/stores/friends.store";
import dayjs from "../../plugins/dayjs";
import CommsMessageActions from "@/components/Communications/CommsMessageActions.vue";
import TpuHover from "@/components/Core/Hover/TpuHover.vue";
import { onMounted, onUnmounted, ref } from "vue";
import MessageReply from "@/components/Communications/MessageReply.vue";

const hovered = ref(false);
const friendsStore = useFriendsStore();
const userStore = useUserStore();
const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true
  },
  dateSeparator: {
    type: Boolean
  },
  mentions: {
    type: Boolean
  },
  editing: {
    type: Boolean
  },
  editingText: {
    type: String
  },
  merge: {
    type: Boolean
  },
  search: {
    type: Boolean
  }
});

function blocked(userId?: number) {
  return userStore.blocked.find(
    (block) => block.blockedUserId === userId ?? props.message.userId
  );
}
</script>

<style scoped>
.merge-date {
  display: none;
}
.hover-message-actions:hover .merge-date {
  display: block;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  min-width: 60px;
  padding: 4px;
}
</style>

<style>
.message-actions {
  display: none;
}

.hover-message-actions:hover .message-actions,
.message-actions:hover .message-actions {
  display: block;
}
.message a {
  color: #0190ea;
}
.overflow-content * {
  white-space: pre-line !important;
  overflow-wrap: anywhere !important;
}

.hover-message-actions:hover .message-main {
  @apply bg-card-secondary-dark;
}

.communications .read-receipt-avatars .read-receipt-avatar {
  margin-left: -4px !important;
}
</style>
