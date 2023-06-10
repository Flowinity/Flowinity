<template>
  <li :class="{ merge }" class="message">
    <p
      v-if="(!message.type && !merge) || (message.type === 'message' && !merge)"
      :class="{ 'text-red': message.error }"
      class="unselectable"
    >
      <a
        :id="'message-author-' + message.id"
        class="mr-1 pointer underline-on-hover"
        style="color: unset"
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
        v-if="message.edited"
        :ripple="false"
        color="grey"
        icon
        size="x-small"
        style="margin-bottom: 2px; margin-left: 4px; position: absolute"
      >
        <v-tooltip activator="parent" location="top">
          {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
        </v-tooltip>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </p>
    <span
      v-if="!editing && message.content"
      :class="{ 'text-grey': message.pending, 'text-red': message.error }"
      class="overflow-content"
      v-html="$functions.markdown(message.content)"
    ></span>
    <CommunicationsInput
      v-else
      :editing="true"
      :modelValue="editingText"
      @edit="$emit('edit', { id: null, content: null })"
      @sendMessage="$emit('editMessage', $event)"
      @update:modelValue="$emit('editText', $event)"
    />
    <MessageActions
      :message="message"
      :shifting="shifting"
      @delete="$emit('delete', { message, shifting: $event })"
      @edit="$emit('edit', { id: message.id, content: message.content })"
      @reply="$emit('reply', message)"
    ></MessageActions>
    <Embed
      v-for="(embed, index) in message.embeds"
      :key="index"
      :embed="embed"
    />
  </li>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";
import Embed from "@/components/Communications/Embed.vue";

export default defineComponent({
  name: "MessagePerf",
  components: {
    Embed,
    MessageActions,
    CommunicationsInput
  },
  props: ["message", "editing", "shifting", "editingText", "merge"]
});
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
