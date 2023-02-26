<template>
  <span>
    <v-toolbar
      height="auto"
      v-if="message.reply"
      color="transparent"
      floating
      class="ml-6 my-1 pointer limit"
      @click="$emit('jumpToMessage', message.reply.id)"
    >
      <v-icon class="mr-2">mdi-reply</v-icon>
      <UserAvatar
        size="24"
        :user="message.reply?.user"
        class="mr-2"
      ></UserAvatar>
      {{ message.reply?.content }}
    </v-toolbar>
    <v-toolbar
      v-else-if="message.replyId"
      height="auto"
      color="transparent"
      floating
      class="ml-6 my-1 pointer limit"
    >
      <v-icon class="mr-2">mdi-reply</v-icon>
      <UserAvatar
        size="24"
        :user="{ id: 0, username: '?' }"
        class="mr-2"
      ></UserAvatar>
      Deleted Message
    </v-toolbar>
    <v-list-item color="transparent" class="message" :class="{ merge }">
      <template v-slot:prepend>
        <template v-if="!merge">
          <div
            style="align-items: start !important; display: flex"
            v-if="!message.type || message.type === 'message'"
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
          <div class="mr-3 text-grey" v-else>
            <v-icon v-if="message.type === 'join'" class="mr-1" size="36">
              mdi-account-plus
            </v-icon>
            <v-icon v-else-if="message.type === 'leave'" class="mr-1" size="36">
              mdi-account-minus
            </v-icon>
            <v-icon v-else class="mr-1" size="36">mdi-information</v-icon>
          </div>
        </template>
        <template v-else>
          <small
            style="font-size: 9px; margin-right: 20px"
            class="text-grey message-date"
            v-if="merge"
          >
            <v-tooltip activator="parent" location="top" style="z-index: 2001">
              {{ $date(message.createdAt).format("hh:mm:ss A DD/MM/YYYY") }}
            </v-tooltip>
            {{ $date(message.createdAt).format("hh:mm A") }}
          </small>
        </template>
      </template>
      <p
        v-if="
          (!message.type && !merge) || (message.type === 'message' && !merge)
        "
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
      <template v-slot:append>
        <div>
          <template v-for="readReceipt in message.readReceipts">
            <UserAvatar
              :user="readReceipt.user"
              :key="readReceipt.userId + '-' + message.id"
              size="24"
              class="pointer ml-2"
              v-if="readReceipt?.user"
              style="align-self: flex-end"
              :id="
                'message-read-receipt-' + message.id + '-' + readReceipt.userId
              "
              @click="
                $chat.dialogs.user.username = readReceipt.user.username;
                $chat.dialogs.user.value = true;
              "
            >
              <template v-slot:inline>
                <v-tooltip activator="parent" location="top">
                  {{ readReceipt.user?.username }}
                </v-tooltip>
              </template>
            </UserAvatar>
          </template>
        </div>
      </template>
    </v-list-item>
  </span>
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

<style>
.message .v-list-item__prepend {
  align-items: start !important;
  align-self: flex-start !important;
  margin-top: 5px;
}

.message .v-list-item__append {
  align-items: end !important;
  align-self: flex-end !important;
  margin-bottom: 5px;
}
</style>
