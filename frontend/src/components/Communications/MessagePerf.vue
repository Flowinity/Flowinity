<template>
  <li color="transparent" class="message" :class="{ merge }">
    <p
      v-if="(!message.type && !merge) || (message.type === 'message' && !merge)"
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
        {{ $date(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
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
      class="overflow-content"
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
      @reply="$emit('reply', message)"
      @delete="$emit('delete', { message, shifting: $event })"
      @pin="$emit('pin', message)"
    ></MessageActions>
    <Embed
      v-for="(embed, index) in message.embeds"
      :embed="embed"
      :key="index"
    />
  </li>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";
import Embed from "@/components/Communications/Embed.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "Message",
  components: {
    UserAvatar,
    Embed,
    MessageActions,
    CommunicationsAvatar,
    CommunicationsInput
  },
  props: ["message", "editing", "shifting", "editingText", "merge"]
});
</script>

<style scoped></style>
