<template>
  <li class="position-relative">
    <div v-if="dateSeparator" class="date-separator">
      <div class="date-separator-line"></div>
      <p class="date-separator-block unselectable">
        {{ $date(message.createdAt).format("ddd, Do of MMMM YYYY") }}
      </p>
      <div class="date-separator-line"></div>
    </div>
    <div
      v-if="message.replyId"
      class="ml-7 unselectable mt-4 mb-n3 pointer limit reply d-flex align-center"
      @click.prevent="
        message.reply && !search
          ? $emit('jumpToMessage', message.replyId)
          : () => {}
      "
    >
      <reply-line class="mt-2"></reply-line>
      <span class="mt-n2" v-if="message.reply">
        <UserAvatar
          :user="$user.users[message.reply.userId]"
          class="mr-2"
          size="18"
          style="padding-left: 6px"
        ></UserAvatar>
        <span
          :style="{
            opacity: 0.8,
            color: this.$chat.getRankColor(
              this.$chat.selectedChat.users.find(
                (assoc) => assoc.userId === message.reply.userId
              )?.ranksMap,
              this.$chat.selectedChat.ranks
            ),
            'margin-left': '-1px'
          }"
        >
          {{
            $user.users[message.reply.userId]?.username ||
            message.reply.user?.username
          }}
        </span>
        <template v-if="!blocked($user.users[message.reply.userId].id)">
          <template v-if="message.reply.embeds.length">
            <v-icon class="ml-1" color="#878686">mdi-image</v-icon>
          </template>
          <span class="limit ml-1" style="color: #878686">
            {{ message.reply?.content || "Click to see attachment..." }}
          </span>
        </template>
        <template v-else>
          <span class="limit ml-1" style="color: #878686">
            Blocked message...
          </span>
        </template>
      </span>
      <template v-else>
        <span class="text-grey text-small mt-n2 ml-2">Message deleted.</span>
      </template>
    </div>
    <div
      class="d-flex flex-row hover-message-actions"
      @mouseover="hovered = true"
    >
      <div class="flex-grow-tpu">
        <div
          @contextmenu="context"
          :class="{ merge, unselectable: $vuetify.display.mobile }"
          class="message rounded position-relative"
        >
          <div class="avatar-section">
            <small
              v-if="merge"
              class="mr-1 text-grey message-date"
              style="font-size: 9px"
            >
              <v-tooltip
                activator="parent"
                location="top"
                style="z-index: 2001"
              >
                {{ $date(message.createdAt).format("hh:mm:ss A DD/MM/YYYY") }}
              </v-tooltip>
              {{ $date(message.createdAt).format("hh:mm A") }}
            </small>
            <UserAvatar
              @click="
                $emit('authorClick', {
                  user,
                  bindingElement: 'message-author-avatar-' + message.id,
                  x: $event.x,
                  y: $event.y
                })
              "
              class="pointer"
              v-else-if="
                !merge &&
                (message.type === MessageType.Message || !message.type)
              "
              :user="user"
              :id="'message-author-avatar-' + message.id"
            />
            <div v-else class="mr-3 text-grey">
              <v-icon
                v-if="message.type === MessageType.Join"
                class="mr-1"
                size="32"
              >
                mdi-account-plus
              </v-icon>
              <v-icon
                v-else-if="message.type === MessageType.Leave"
                class="mr-1"
                size="32"
              >
                mdi-account-minus
              </v-icon>
              <v-icon v-else-if="message.type === MessageType.Pin" size="32">
                mdi-pin
              </v-icon>
              <v-icon v-else class="mr-1" size="32">mdi-information</v-icon>
            </div>
          </div>
          <div style="width: 100%">
            <p
              v-if="
                (!message.type && !merge) ||
                (message.type === MessageType.Message && !merge)
              "
              :class="{ 'text-red': message.error }"
              class="unselectable"
            >
              <span
                :id="'message-author-' + message.id"
                class="mr-2 pointer underline-on-hover"
                :style="`color: ${getColor}`"
                @click.prevent="
                  $emit('authorClick', {
                    user,
                    bindingElement: 'message-author-' + message.id,
                    x: $event.x,
                    y: $event.y
                  })
                "
              >
                {{ $friends.getName(user) }}
              </span>
              <small class="text-grey">
                {{ $date(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
              </small>
            </p>
            <div class="position-relative" v-if="!editing">
              <span
                :class="{
                  'text-grey': message.pending,
                  'text-red': message.error
                }"
                class="overflow-content message-content d-inline-block"
                v-html="$functions.markdown(message.content)"
              ></span>
              <span
                v-if="message.edited"
                :ripple="false"
                class="d-inline-block"
              >
                <v-tooltip activator="parent" location="top">
                  {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
                </v-tooltip>
                <v-icon color="grey" class="ml-1 mb-1" size="x-small">
                  mdi-pencil
                </v-icon>
              </span>
            </div>
            <CommunicationsInput
              v-if="editing"
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
              @edit="
                $emit('edit', { id: message.id, content: message.content })
              "
              @reply="$emit('reply', message)"
              :merge="merge"
            />
            <Embed
              v-for="(embed, index) in message.embeds"
              :key="index"
              :embed="embed"
            />
          </div>
        </div>
      </div>
      <div
        class="flex-shrink-1 align-self-end mb-1"
        style="width: 120px"
        v-if="!$vuetify.display.mobile && !search"
      >
        <div
          style="justify-content: flex-end; display: flex; padding-right: 8px"
          :class="{ 'read-receipt-avatars': message.readReceipts.length > 3 }"
        >
          <template
            v-for="(readReceipt, index) in message.readReceipts"
            :key="readReceipt.id"
          >
            <ReadReceipt
              v-if="index < $chat.renderableReadReceipts"
              :message="message"
              :read-receipt="readReceipt"
              :class="{ 'ml-1': message.readReceipts.length <= 3 }"
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
            <span>
              +{{ message.readReceipts.length - $chat.renderableReadReceipts }}
              <v-tooltip activator="parent" location="top">
                <ReadReceipt
                  :message="message"
                  v-for="readReceipt in message.readReceipts"
                  :read-receipt="readReceipt"
                  :expanded="true"
                />
              </v-tooltip>
            </span>
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
import { Message, MessageType } from "@/gql/graphql";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import ReplyLine from "@/components/Communications/ReplyLine.vue";

export default defineComponent({
  name: "MessagePerf",
  components: {
    ReplyLine,
    MessageSkeleton,
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
    "index",
    "search",
    "uncollapseBlocked"
  ],
  data() {
    return {
      hovered: false,
      streamedReply: null as Message | null
    };
  },
  computed: {
    MessageType() {
      return MessageType;
    },
    user() {
      return this.$user.users[this.message.userId];
    },
    getColor() {
      return this.$user.disableProfileColors
        ? "unset"
        : this.$chat.getRankColor(
            this.$chat.selectedChat.users.find(
              (assoc) => assoc.userId === this.message.userId
            )?.ranksMap,
            this.$chat.selectedChat.ranks
          );
    }
  },
  methods: {
    blocked(userId?: number) {
      return this.$user.blocked.find(
        (block) => block.blockedUserId === userId ?? this.message.userId
      );
    },
    context(e: any) {
      e.preventDefault();
      this.$chat.dialogs.message.message = this.message;
      this.$chat.dialogs.message.x = e.clientX;
      this.$chat.dialogs.message.y = e.clientY;
      this.$chat.dialogs.message.value = true;
    },
    onEdit(data: Message) {
      if (data?.id !== this.message.replyId) return;
      if (data.content) {
        this.message.reply.content = data.content;
      }
      if (data.edited !== undefined) {
        this.message.reply.edited = data.edited;
      }
      if (data.editedAt !== undefined) {
        this.message.reply.editedAt = data.editedAt;
      }
      if (data.pinned !== undefined) {
        this.message.reply.pinned = data.pinned;
      }
    },
    onDelete(data: Message) {
      if (data?.id !== this.message.replyId) return;
      this.message.reply = null;
    }
  },
  mounted() {
    if (!this.message.reply?.id) return;
    this.$sockets.chat.on("edit", this.onEdit);
    this.$sockets.chat.on("messageDelete", this.onDelete);
  },
  beforeUnmount() {
    if (!this.message.reply?.id) return;
    this.$sockets.chat.off("edit", this.onEdit);
    this.$sockets.chat.off("messageDelete", this.onDelete);
  }
});
</script>

<style scoped>
li {
  list-style-type: none;
}

.flex-grow-tpu {
  flex-grow: 1;
  flex-basis: 0;
}
</style>
