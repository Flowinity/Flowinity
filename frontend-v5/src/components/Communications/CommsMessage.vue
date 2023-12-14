<template>
  <div class="flex-col items-center">
    <message-reply :reply="message.reply" class="ml-9 items-center mt-2" />
    <div
      v-bind="$attrs"
      :ref="`message-${message.id}`"
      class="message hover-message-actions flex"
      :class="{
        'mt-2': !merge && !message.reply,
        'mt-1': message.reply
      }"
      @mouseenter="hovered = true"
    >
      <div class="flex flex-grow basis-0 message-main relative rounded-l">
        <div class="avatar-section" :class="{ 'justify-center': merge }">
          <UserAvatar
            v-if="!merge"
            :user-id="message.userId || 0"
            :username="message.user?.username"
          />
          <p
            v-else
            style="font-size: 10px"
            class="text-medium-emphasis-dark merge-date"
          >
            {{ $date(message.createdAt).format("hh:mm A") }}
          </p>
        </div>
        <div class="flex-col">
          <div v-if="!merge" class="flex items-center">
            {{ friendsStore.getName(message.userId) }}
            <p class="text-medium-emphasis-dark text-sm ml-2">
              {{ dayjs(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
            </p>
          </div>
          <div class="relative inline-block">
            <span
              v-memo="[message.content, message.error, message.pending]"
              class="overflow-content"
              :class="{
                'text-medium-emphasis-dark': message.pending,
                'text-red': message.error
              }"
              v-html="$functions.markdown(message.content || '', message)"
            ></span>
          </div>
          <div class="flex-col flex">
            <comms-message-embed
              v-for="embed in message.embeds"
              :key="embed"
              :embed="embed"
            />
          </div>
        </div>
        <comms-message-actions
          v-if="hovered"
          @reply="$emit('reply', message.id)"
        ></comms-message-actions>
      </div>
      <div
        v-if="!search"
        class="flex-shrink-1 justify-end align-bottom relative align-self-end h-full flex flex-col items-end"
        style="width: 100px; height: 100%"
      >
        <div
          class="flex align-bottom h-100"
          :class="{ 'read-receipt-avatars': message.readReceipts.length > 3 }"
        >
          <user-avatar
            v-for="readReceipt in message.readReceipts"
            :key="readReceipt.id"
            v-tooltip="userStore.users[readReceipt.userId || 0]?.username"
            :user-id="readReceipt.userId || 0"
            :class="{ 'ml-1': message.readReceipts.length <= 3 }"
            size="22"
            class="read-receipt-avatar"
          ></user-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "@/gql/graphql";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useUserStore } from "@/stores/user.store";
import { useFriendsStore } from "@/stores/friends.store";
import dayjs from "../../plugins/dayjs";
import CommsMessageActions from "@/components/Communications/CommsMessageActions.vue";
import { onMounted, ref, watch } from "vue";
import MessageReply from "@/components/Communications/MessageReply.vue";
import CommsMessageEmbed from "@/components/Communications/CommsMessageEmbed.vue";

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

const emit = defineEmits(["reply", "autoScroll"]);

function blocked(userId?: number) {
  return userStore.blocked.find(
    (block) => block.blockedUserId === userId ?? props.message.userId
  );
}

onMounted(() => {});

watch(
  () => [props.message?.embeds, props.message?.content],
  () => {
    emit("autoScroll");
  },
  {
    deep: true
  }
);
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
