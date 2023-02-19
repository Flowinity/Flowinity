<template>
  <v-list-item color="transparent" class="message">
    <template v-slot:prepend>
      <div
        @click="
          $emit('authorClick', {
            user: message.user,
            bindingElement: 'message-author-avatar-' + message.id,
            x: $event.x,
            y: $event.y
          })
        "
        class="pointer mr-3"
      >
        <CommunicationsAvatar
          :user="message.user"
          :id="'message-author-avatar-' + message.id"
        ></CommunicationsAvatar>
      </div>
    </template>
    <p
      v-if="!message.type || message.type === 'message'"
      class="unselectable"
      :class="{ 'text-red': message.error }"
    >
      <a
        class="mr-1 pointer underline-on-hover"
        style="color: unset"
        :id="'message-author-' + message.id"
        @click.prevent="
          $emit('authorClick', {
            user: message.user,
            bindingElement: 'message-author-' + message.id,
            x: $event.x,
            y: $event.y
          })
        "
      >
        {{ message.user?.username }}
      </a>
      <small class="text-grey">
        {{ $date(message.createdAt).format("hh:mm A, DD/MM/YYYY") }}
      </small>
      <v-btn
        color="grey"
        icon
        size="x-small"
        :ripple="false"
        v-if="message.edited"
        style="margin-bottom: 2px; margin-left: 4px; position: absolute"
      >
        <v-tooltip activator="parent" location="top">
          {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
        </v-tooltip>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </p>
    <span
      v-if="!editing"
      class="message-contents"
      :class="{ 'text-grey': message.pending, 'text-red': message.error }"
      v-html="$functions.markdown(message.content)"
    ></span>
    <CommunicationsInput
      @edit="$emit('edit', { id: null, content: null })"
      v-else
      :modelValue="editingText"
      @update:modelValue="$emit('editText', $event)"
      :editing="true"
      @sendMessage="$emit('editMessage', $event)"
    />
    <MessageActions
      @edit="$emit('edit', { id: message.id, content: message.content })"
      :shifting="shifting"
      :message="message"
    ></MessageActions>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";

export default defineComponent({
  name: "Message",
  components: { MessageActions, CommunicationsAvatar, CommunicationsInput },
  props: ["message", "editing", "shifting", "editingText"]
});
</script>

<style scoped></style>
