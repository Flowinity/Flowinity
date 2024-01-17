<template>
  <div v-if="reply" class="flex select-none truncate overflow-hidden">
    <reply-line v-if="line" class="mt-2"></reply-line>
    <UserAvatar :user-id="reply?.userId || 0" size="24" class="mx-1" />
    <span
      v-memo="[reply.content]"
      class="whitespace-nowrap overflow-x-hidden overflow-ellipsis text-[#878787]"
    >
      {{ reply.content }}
    </span>
  </div>
</template>

<script setup lang="ts">
import ReplyLine from "@/components/Communications/ReplyLine.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { Message } from "@/gql/graphql";

defineProps({
  reply: {
    type: Object as () => Message
  },
  line: {
    type: Boolean,
    default: true
  }
});
</script>
