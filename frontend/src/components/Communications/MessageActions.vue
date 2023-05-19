<template>
  <v-card
    v-if="!$vuetify.display.mobile"
    :class="{ 'no-hide': avoid }"
    class="message-actions"
    elevation="8"
    style="z-index: 6001"
  >
    <v-btn :size="size" icon rounded="0" @click="$emit('emote')">
      <v-tooltip activator="parent" location="top">React</v-tooltip>
      <v-icon>mdi-emoticon-happy</v-icon>
    </v-btn>
    <v-btn
      v-if="message.userId === $user.user?.id && message.type === 'message'"
      :size="size"
      icon
      rounded="0"
      @click="$emit('edit')"
    >
      <v-tooltip activator="parent" location="top">Edit</v-tooltip>
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      v-if="
        (message.userId === $user.user?.id && message.type === 'message') ||
        ($chat.hasPermissions.admin && message.type === 'message')
      "
      :size="size"
      icon
      rounded="0"
      @click="$emit('delete', $event.shiftKey)"
    >
      <v-tooltip activator="parent" location="top">Delete</v-tooltip>
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn :size="size" icon rounded="0" @click="$emit('reply')">
      <v-tooltip activator="parent" location="top">Reply</v-tooltip>
      <v-icon>mdi-reply</v-icon>
    </v-btn>
    <v-btn :size="size" icon rounded="0" @click="$functions.copy(message.id)">
      <v-tooltip activator="parent" location="top">Copy ID</v-tooltip>
      <v-icon>mdi-identifier</v-icon>
    </v-btn>
    <v-menu
      v-if="
        $chat.selectedChat?.association.rank &&
        ['admin', 'owner'].includes($chat.selectedChat?.association.rank)
      "
      location="top center"
      @update:modelValue="$emit('avoid', $event)"
    >
      <template v-slot:activator="{ props }">
        <v-btn :size="size" icon rounded="0" v-bind="props">
          <v-tooltip activator="parent" location="top">More</v-tooltip>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list :size="size" class="mb-2 rounded-xl">
        <v-list-item
          :size="size"
          color="red"
          style="min-height: 20px"
          @click="$chat.pinMessage(message.id, !message.pinned)"
        >
          <v-list-item-title>
            <v-icon class="mr-1">
              {{ message.pinned ? "mdi-pin-off" : "mdi-pin" }}
            </v-icon>
            {{ message.pinned ? "Unpin" : "Pin" }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageActions",
  props: ["message", "avoid"],
  data() {
    return {
      size: "small"
    };
  }
});
</script>

<style scoped></style>
