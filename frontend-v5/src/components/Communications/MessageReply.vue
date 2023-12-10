<template>
  <div v-if="reply" class="flex">
    <reply-line v-if="line" class="mt-2"></reply-line>
    <UserAvatar :user-id="reply?.userId || 0" size="24" class="mx-1" />
    <span
      v-memo="[reply.content]"
      class="overflow-content text-[#878787]"
      v-html="$functions.markdownReply(reply.content || '', reply)"
    ></span>
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
