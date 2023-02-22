<template>
  <v-card
    elevation="8"
    color="card"
    class="message-actions"
    :class="{ 'no-hide': avoid }"
    v-if="!$vuetify.display.mobile"
    style="z-index: 50"
  >
    <v-btn icon @click="$emit('emote')" rounded="0">
      <v-tooltip location="top" activator="parent">React</v-tooltip>
      <v-icon>mdi-emoticon-happy</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="$emit('edit')"
      rounded="0"
      v-if="message.userId === $user.user?.id && message.type === 'message'"
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
    >
      <v-tooltip location="top" activator="parent">Delete</v-tooltip>
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('reply')" rounded="0">
      <v-tooltip location="top" activator="parent">Reply</v-tooltip>
      <v-icon>mdi-reply</v-icon>
    </v-btn>
    <v-menu location="top left" v-model="avoid" v-if="!shifting">
      <template v-slot:activator="{ props }">
        <v-btn icon rounded="0" v-bind="props">
          <v-tooltip location="top" activator="parent">More</v-tooltip>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="mb-2 rounded-xl">
        <v-list-item @click="$emit('pin')" color="red">
          <v-list-item-title>
            <v-icon class="mr-1">mdi-pin</v-icon>
            Pin
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="$emit('delete', $event.shiftKey)"
          color="red"
          v-if="message.userId === $user.user?.id"
        >
          <v-list-item-title>
            <v-icon class="mr-1">mdi-delete</v-icon>
            Delete
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
  props: ["message", "shifting"],
  data() {
    return {
      avoid: false
    };
  }
});
</script>

<style scoped></style>
