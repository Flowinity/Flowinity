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
    <template v-slot:inline>
      <v-tooltip activator="parent" location="top" style="z-index: 3001">
        {{ readReceipt.user?.username }}
      </v-tooltip>
    </template>
  </UserAvatar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "ReadReceipt",
  components: { UserAvatar },
  props: {
    readReceipt: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    }
  }
});
</script>

<style scoped></style>
