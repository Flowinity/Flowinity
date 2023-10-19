<template>
  <div
    class="relative message hover:bg-card-secondary-dark hover-message-actions"
    :class="{ 'mt-2': !merge }"
    :ref="`message-${message.id}`"
    @mouseenter="hovered = true"
    @mouseleave="hovering = false"
  >
    <div class="flex flex-grow basis-0">
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
        <span
          :class="{
            'text-grey': message.pending,
            'text-red': message.error
          }"
          class="overflow-content message-content d-inline-block"
          v-html="$functions.markdown(message.content || '', message)"
          v-memo="[message.content, message.error, message.pending]"
        ></span>
      </div>
    </div>
    <comms-message-actions v-if="hovered"></comms-message-actions>
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
</style>
