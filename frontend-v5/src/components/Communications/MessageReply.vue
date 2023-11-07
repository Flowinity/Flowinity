<template>
  <div v-if="reply" class="flex">
    <reply-line class="mt-2" v-if="line"></reply-line>
    <UserAvatar :user-id="reply?.userId || 0" size="24" class="mx-1" />
    <span
      class="overflow-content text-[#878787]"
      v-html="$functions.markdownReply(reply.content || '', reply)"
      v-memo="[reply.content]"
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
