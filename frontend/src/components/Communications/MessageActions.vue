<template>
  <div
    v-if="!$vuetify.display.mobile"
    :class="{ 'no-hide': avoid }"
    class="message-actions mr-2 rounded-xl v-card"
    style="z-index: 5001; background-color: rgb(var(--v-theme-dark))"
  >
    <span class="mr-2" v-if="message.readReceipts?.length && merge">
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
                <ReadReceipt :message="message" :read-receipt="readReceipt" />
              </span>
            </v-container>
          </v-card>
        </v-menu>
        +{{ message.readReceipts.length - $chat.renderableReadReceipts }}
      </span>
    </span>
    <button
      type="button"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      @click="$chat.pinMessage(message.id, !message.pinned)"
      v-if="$chat.hasPermissions.admin && message.type === 'message'"
    >
      <v-tooltip activator="parent" location="top" :eager="false">
        {{ message.pinned ? "Unpin" : "Pin" }}
      </v-tooltip>
      <v-icon>
        {{ message.pinned ? "mdi-pin-off" : "mdi-pin" }}
      </v-icon>
    </button>
    <button
      type="button"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      v-if="message.userId === $user.user?.id && message.type === 'message'"
      @click="$emit('edit')"
    >
      <v-tooltip activator="parent" location="top" :eager="false">
        Edit
      </v-tooltip>
      <v-icon>mdi-pencil</v-icon>
    </button>
    <button
      type="button"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      v-if="
        (message.userId === $user.user?.id && message.type === 'message') ||
        ($chat.hasPermissions.admin && message.type === 'message')
      "
      @click="$emit('delete', $event.shiftKey)"
    >
      <v-tooltip activator="parent" location="top" :eager="false">
        Delete
      </v-tooltip>
      <v-icon>mdi-delete</v-icon>
    </button>
    <button
      type="button"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      @click="$emit('reply')"
    >
      <v-tooltip activator="parent" location="top" :eager="false">
        Reply
      </v-tooltip>
      <v-icon>mdi-reply</v-icon>
    </button>
    <button
      type="button"
      class="v-btn v-btn--icon v-theme--amoled v-btn--density-default rounded-0 v-btn--size-small v-btn--variant-text"
      @click="$functions.copy(message.id)"
    >
      <v-tooltip activator="parent" location="top" :eager="false">
        Copy ID
      </v-tooltip>
      <v-icon>mdi-identifier</v-icon>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReadReceipt from "@/components/Communications/ReadReceipt.vue";

export default defineComponent({
  name: "MessageActions",
  components: { ReadReceipt },
  props: ["message", "avoid", "merge"],
  data() {
    return {
      size: "small"
    };
  }
});
</script>

<style scoped></style>
