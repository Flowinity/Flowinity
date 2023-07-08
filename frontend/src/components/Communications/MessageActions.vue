<template>
  <div
    v-if="!$vuetify.display.mobile"
    :class="{ 'no-hide': avoid }"
    class="message-actions mr-2 rounded-xl v-card"
    style="z-index: 5001; background-color: rgb(var(--v-theme-dark))"
  >
    <span v-if="message.readReceipts?.length && merge" class="mr-2">
      <template
        v-for="(readReceipt, index) in message.readReceipts"
        :key="readReceipt.id"
      >
        <ReadReceipt
          v-if="index < $chat.renderableReadReceipts"
          :message="message"
          :read-receipt="readReceipt"
        />
      </template>
      <span
        v-if="message.readReceipts.length > $chat.renderableReadReceipts"
        class="text-grey ml-1 mr-2"
        @click.stop
      >
        <v-menu activator="parent" location="top">
          <v-card>
            <v-container>
              <span v-for="readReceipt in message.readReceipts">
                <ReadReceipt :message="message" :read-receipt="readReceipt"/>
              </span>
            </v-container>
          </v-card>
        </v-menu>
        +{{ message.readReceipts.length - $chat.renderableReadReceipts }}
      </span>
    </span>
    <button
      v-if="$chat.hasPermissions.admin && message.type === 'message'"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      type="button"
      @click="$chat.pinMessage(message.id, !message.pinned)"
    >
      <v-tooltip :eager="false" activator="parent" location="top">
        {{ message.pinned ? "Unpin" : "Pin" }}
      </v-tooltip>
      <v-icon>
        {{ message.pinned ? "mdi-pin-off" : "mdi-pin" }}
      </v-icon>
    </button>
    <button
      v-if="message.userId === $user.user?.id && message.type === 'message'"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      type="button"
      @click="$emit('edit')"
    >
      <v-tooltip :eager="false" activator="parent" location="top">
        Edit
      </v-tooltip>
      <v-icon>mdi-pencil</v-icon>
    </button>
    <button
      v-if="
        (message.userId === $user.user?.id && message.type === 'message') ||
        ($chat.hasPermissions.admin && message.type === 'message')
      "
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      type="button"
      @click="$emit('delete', $event.shiftKey)"
    >
      <v-tooltip :eager="false" activator="parent" location="top">
        Delete
      </v-tooltip>
      <v-icon>mdi-delete</v-icon>
    </button>
    <button
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      type="button"
      @click="$emit('reply')"
    >
      <v-tooltip :eager="false" activator="parent" location="top">
        Reply
      </v-tooltip>
      <v-icon>mdi-reply</v-icon>
    </button>
    <button
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      type="button"
      @click="$functions.copy(message.id)"
    >
      <v-tooltip :eager="false" activator="parent" location="top">
        Copy ID
      </v-tooltip>
      <v-icon>mdi-identifier</v-icon>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ReadReceipt from "@/components/Communications/ReadReceipt.vue";

export default defineComponent({
  name: "MessageActions",
  components: {ReadReceipt},
  props: ["message", "avoid", "merge"],
  data() {
    return {
      size: "small"
    };
  }
});
</script>

<style scoped></style>
