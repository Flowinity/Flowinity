<template>
  <v-list-item color="transparent">
    <template v-slot:prepend>
      <v-avatar :color="!message.user?.avatar ? '#0190ea' : undefined">
        <v-img
          :src="$functions.avatar($chat.selectedChat)"
          v-if="message.user?.avatar"
        ></v-img>
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
    </template>
    <p
      v-if="!message.type || message.type === 'message'"
      :class="{ 'text-red': message.error }"
    >
      {{ message.user?.username }}
      <small class="text-grey">
        {{ $date(message.createdAt).format("hh:mm A, DD/MM/YYYY") }}
      </small>
      <v-icon
        color="grey"
        small
        v-if="message.edited"
        style="margin-bottom: 2px; margin-left: 4px; position: absolute"
      >
        <v-tooltip activator="parent" location="top">
          {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
        </v-tooltip>
        mdi-pencil
      </v-icon>
    </p>
    <span
      v-if="!editing"
      class="message-contents"
      :class="{ 'text-grey': message.pending, 'text-red': message.error }"
    >
      {{ message.content }}
    </span>
    <CommunicationsInput v-else :modelValue="message.content" :editing="true" />
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";

export default defineComponent({
  name: "Message",
  components: { CommunicationsInput },
  props: ["message", "editing"]
});
</script>

<style scoped></style>
