<template>
  <span>
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        class="message-actions"
        elevation="8"
        :class="{ 'no-hide': isHovering }"
        style="z-index: 1000"
        v-bind="props"
      >
        {{ isHovering }}
        <minimal-button icon="mdi-emoticon-happy"></minimal-button>
        <minimal-button
          v-if="message.userId === $user.user?.id && message.type === 'message'"
          icon="mdi-pencil"
          @click="$emit('edit')"
        ></minimal-button>
        <minimal-button
          v-if="
            (message.userId === $user.user?.id && message.type === 'message') ||
            ($chat.hasPermissions.admin && message.type === 'message')
          "
          icon="mdi-delete"
          @click="$emit('delete', $event.shiftKey)"
        ></minimal-button>
        <minimal-button
          icon="mdi-reply"
          @click="$emit('reply')"
        ></minimal-button>
        <minimal-button
          icon="mdi-identifier"
          @click="$functions.copy(message.id)"
        ></minimal-button>
      </v-card>
    </v-hover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MinimalButton from "./MinimalButton.vue";

export default defineComponent({
  name: "MessageActions",
  props: ["message", "avoid"],
  data() {
    return {
      size: "small"
    };
  },
  components: { MinimalButton }
});
</script>

<style scoped></style>
