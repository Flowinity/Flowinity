<template>
  <UserAvatar
    v-if="readReceipt?.user"
    :id="'message-read-receipt-' + message.id + '-' + readReceipt.userId"
    :key="readReceipt.userId + '-' + message.id"
    :user="readReceipt.user"
    class="pointer ml-2"
    size="24"
    style="align-self: flex-end; z-index: 1"
    @click.prevent="
      $chat.dialogs.user.username = readReceipt.user.username;
      $chat.dialogs.user.value = true;
    "
  >
    <v-tooltip activator="parent" location="top" :eager="false" offset="18">
      {{ readReceipt.user?.username }}
    </v-tooltip>
  </UserAvatar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { User } from "@/models/user";
import { Message } from "@/models/message";

interface ReadReceipt {
  id: number;
  userId: number;
  user: User;
}

export default defineComponent({
  name: "ReadReceipt",
  components: { UserAvatar },
  props: {
    readReceipt: {
      type: Object as () => ReadReceipt,
      required: true
    },
    message: {
      type: Object as () => Message,
      required: true
    }
  }
});
</script>

<style scoped></style>
