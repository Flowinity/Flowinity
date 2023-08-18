<template>
  <li>
    <div v-if="dateSeparator" class="date-separator">
      <div class="date-separator-line"></div>
      <p class="date-separator-block unselectable">
        {{ $date(message.createdAt).format("ddd, Do of MMMM YYYY") }}
      </p>
      <div class="date-separator-line"></div>
    </div>
    <v-toolbar
      v-if="message.replyId"
      class="ml-6 my-1 pointer limit"
      color="transparent"
      :floating="true"
      height="auto"
      @click.prevent="$emit('jumpToMessage', message.reply?.id)"
    >
      <v-icon class="mr-2">mdi-reply</v-icon>
      <UserAvatar
        :user="message.reply?.user"
        class="mr-2"
        size="24"
      ></UserAvatar>
      {{ message.reply?.content ?? "Deleted Message" }}
    </v-toolbar>
    <div
      @contextmenu="context"
      :class="{ merge, unselectable: $vuetify.display.mobile }"
      class="message position-relative"
      @mouseover="hovered = true"
      :style="{
        zIndex: 1000 - index
      }"
    >
      <small
        v-if="merge"
        class="ml-2 text-grey message-date"
        style="font-size: 9px"
      >
        <v-tooltip activator="parent" location="top" style="z-index: 2001">
          {{ $date(message.createdAt).format("hh:mm:ss A DD/MM/YYYY") }}
        </v-tooltip>
        {{ $date(message.createdAt).format("hh:mm A") }}
      </small>
      <UserAvatar
        @click="
          $emit('authorClick', {
            user: message.user,
            bindingElement: 'message-author-avatar-' + message.id,
            x: $event.x,
            y: $event.y
          })
        "
        class="ml-2 mr-3 mt-1 pointer"
        v-if="!merge"
        :user="message.user"
        :id="'message-author-avatar-' + message.id"
      />
      <div style="width: 100%">
        <p
          v-if="
            (!message.type && !merge) || (message.type === 'message' && !merge)
          "
          :class="{ 'text-red': message.error }"
          class="unselectable"
        >
          <a
            :id="'message-author-' + message.id"
            class="mr-1 pointer underline-on-hover"
            :style="`color: ${
              $user.disableProfileColors ? 'unset' : user?.nameColor ?? 'unset'
            }`"
            @click.prevent="
              $emit('authorClick', {
                user: message.user,
                bindingElement: 'message-author-' + message.id,
                x: $event.x,
                y: $event.y
              })
            "
          >
            {{ $friends.getName(message.user) }}
          </a>
          <small class="text-grey">
            {{ $date(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
          </small>
        </p>
        <div class="position-relative" v-if="!editing">
          <span
            :class="{ 'text-grey': message.pending, 'text-red': message.error }"
            class="overflow-content message-content d-inline-block"
            v-html="$functions.markdown(message.content)"
          ></span>
          <span v-if="message.edited" :ripple="false" class="d-inline-block">
            <v-tooltip activator="parent" location="top">
              {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
            </v-tooltip>
            <v-icon color="grey" class="ml-1 mb-1" size="x-small">
              mdi-pencil
            </v-icon>
          </span>
        </div>

        <CommunicationsInput
          v-else
          :editing="true"
          :modelValue="editingText"
          @edit="$emit('edit', { id: null, content: null })"
          @sendMessage="$emit('editMessage', $event)"
          @update:modelValue="$emit('editText', $event)"
          style="width: 100%"
        />
        <MessageActions
          :message="message"
          v-if="hovered && !$vuetify.display.mobile"
          @delete="$emit('delete', { message, shifting: $event })"
          @edit="$emit('edit', { id: message.id, content: message.content })"
          @reply="$emit('reply', message)"
          :merge="merge"
        />
        <Embed
          v-for="(embed, index) in message.embeds"
          :key="index"
          :embed="embed"
        />
        <div
          style="
            position: absolute;
            right: 10px;
            bottom: 0;
            padding-bottom: 5px;
          "
        >
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
                    <ReadReceipt
                      :message="message"
                      :read-receipt="readReceipt"
                    />
                  </span>
                </v-container>
              </v-card>
            </v-menu>
            +{{ message.readReceipts.length - $chat.renderableReadReceipts }}
          </span>
        </div>
      </div>
    </div>
  </li>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";
import Embed from "@/components/Communications/Embed.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import ReadReceipt from "@/components/Communications/ReadReceipt.vue";
import { Chat } from "@/models/chat";
import { ChatAssociation } from "@/models/chatAssociation";

export default defineComponent({
  name: "MessagePerf",
  components: {
    ReadReceipt,
    UserAvatar,
    Embed,
    MessageActions,
    CommunicationsInput
  },
  props: [
    "message",
    "editing",
    "shifting",
    "editingText",
    "merge",
    "dateSeparator",
    "mentions",
    "index"
  ],
  data() {
    return {
      hovered: false
    };
  },
  computed: {
    user() {
      return this.$chat.chats
        .find((chat: Chat) => chat.id === this.message.chatId)
        ?.users.find(
          (user: ChatAssociation) => user.userId === this.message.userId
        )?.user;
    }
  },
  methods: {
    context(e: any) {
      e.preventDefault();
      this.$chat.dialogs.message.message = this.message;
      this.$chat.dialogs.message.x = e.clientX;
      this.$chat.dialogs.message.y = e.clientY;
      this.$chat.dialogs.message.value = true;
    }
  }
});
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
