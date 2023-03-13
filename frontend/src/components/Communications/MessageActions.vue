<template>
  <v-card
    elevation="8"
    color="card"
    class="message-actions"
    :class="{ 'no-hide': avoid }"
    v-if="!$vuetify.display.mobile"
    style="z-index: 2001"
  >
    <v-btn icon @click="$emit('emote')" rounded="0" :size="size">
      <v-tooltip location="top" activator="parent">React</v-tooltip>
      <v-icon>mdi-emoticon-happy</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="$emit('edit')"
      rounded="0"
      v-if="message.userId === $user.user?.id && message.type === 'message'"
      :size="size"
    >
      <v-tooltip location="top" activator="parent">Edit</v-tooltip>
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="$emit('delete', $event.shiftKey)"
      rounded="0"
      v-if="
        (message.userId === $user.user?.id && message.type === 'message') ||
        ($chat.hasPermissions.admin && message.type === 'message')
      "
      :size="size"
    >
      <v-tooltip location="top" activator="parent">Delete</v-tooltip>
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('reply')" rounded="0" :size="size">
      <v-tooltip location="top" activator="parent">Reply</v-tooltip>
      <v-icon>mdi-reply</v-icon>
    </v-btn>
    <v-menu
      location="top center"
      @update:modelValue="$emit('avoid', $event)"
      v-if="
        $chat.selectedChat?.association.rank &&
        ['admin', 'owner'].includes($chat.selectedChat?.association.rank)
      "
    >
      <template v-slot:activator="{ props }">
        <v-btn icon rounded="0" v-bind="props" :size="size">
          <v-tooltip location="top" activator="parent">More</v-tooltip>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="mb-2 rounded-xl" :size="size">
        <v-list-item
          @click="$chat.pinMessage(message.id, !message.pinned)"
          color="red"
          :size="size"
          style="min-height: 20px"
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
