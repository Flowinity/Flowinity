<template>
  <div class="position-relative">
    <div v-if="dateSeparator" class="date-separator">
      <div class="date-separator-line"></div>
      <p class="date-separator-block unselectable">
        {{ $date(message.createdAt).format("ddd, Do of MMMM YYYY") }}
      </p>
      <div class="date-separator-line"></div>
    </div>
    <v-toolbar
      v-if="message.reply"
      class="ml-6 my-1 pointer limit"
      color="transparent"
      :floating="true"
      height="auto"
      @click.prevent="$emit('jumpToMessage', message.reply.id)"
    >
      <v-icon class="mr-2">mdi-reply</v-icon>
      <UserAvatar
        :user="message.reply?.user"
        class="mr-2"
        size="24"
      ></UserAvatar>
      {{ message.reply?.content }}
    </v-toolbar>
    <v-toolbar
      v-else-if="message.replyId"
      class="ml-6 my-1 pointer limit"
      color="transparent"
      :floating="true"
      height="auto"
    >
      <v-icon class="mr-2">mdi-reply</v-icon>
      <UserAvatar
        :user="{ id: 0, username: '?' }"
        class="mr-2"
        size="24"
      ></UserAvatar>
      Deleted Message
    </v-toolbar>
    <v-hover v-slot="{ isHovering, props }">
      <v-list-item
        :class="{ merge, 'message-mention': mentions }"
        class="message rounded-0"
        color="transparent"
        v-bind="props"
        @contextmenu="context"
      >
        <v-btn
          v-if="
            $chat.selectedChat?.association.rank &&
            ['admin', 'owner'].includes($chat.selectedChat?.association.rank) &&
            pins
          "
          class="mr-2 mt-2 text-grey"
          icon
          size="x-small"
          style="position: absolute; right: 0"
          @click.stop="
            $chat.pinMessage(message.id, !message.pinned).then(() => {
              $emit('refresh');
            })
          "
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-slot:prepend>
          <template v-if="!merge">
            <div
              v-if="!message.type || message.type === 'message'"
              class="pointer mr-3"
              style="align-items: start !important; display: flex"
              @click.prevent="
                $emit('authorClick', {
                  user: message.user,
                  bindingElement: 'message-author-avatar-' + message.id,
                  x: $event.x,
                  y: $event.y
                })
              "
            >
              <UserAvatar
                :id="'message-author-avatar-' + message.id"
                :user="message.user"
                class="mr-2"
              ></UserAvatar>
            </div>
            <div v-else class="mr-3 text-grey">
              <v-icon v-if="message.type === 'join'" class="mr-1" size="36">
                mdi-account-plus
              </v-icon>
              <v-icon
                v-else-if="message.type === 'leave'"
                class="mr-1"
                size="36"
              >
                mdi-account-minus
              </v-icon>
              <v-icon v-else-if="message.type === 'pin'" class="mr-1" size="36">
                mdi-pin
              </v-icon>
              <v-icon v-else class="mr-1" size="36">mdi-information</v-icon>
            </div>
          </template>
          <template v-else>
            <small
              v-if="merge"
              :style="mentions ? 'margin-right: 1.9em' : 'margin-right: 2.30em'"
              class="text-grey message-date"
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
          </template>
        </template>
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
            {{ $friends.getName(message.user) }}
          </a>
          <small class="text-grey">
            {{ $date(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
          </small>
          <span v-if="message.edited">
            <v-tooltip activator="parent" location="top">
              {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
            </v-tooltip>
            <v-icon
              class="ml-3"
              color="grey"
              size="x-small"
              style="display: inline-block"
            >
              mdi-pencil
            </v-icon>
          </span>
        </p>
        <span
          v-if="!editing"
          :class="{ 'text-grey': message.pending, 'text-red': message.error }"
        >
          <span
            class="overflow-content"
            style="display: inline-block"
            v-html="$functions.markdown(message.content)"
          ></span>
          <span v-if="message.edited && merge">
            <v-tooltip activator="parent" location="top">
              {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
            </v-tooltip>
            <v-icon
              class="ml-3"
              color="grey"
              size="x-small"
              style="display: inline-block"
            >
              mdi-pencil
            </v-icon>
          </span>
        </span>
        <CommunicationsInput
          v-else-if="editing"
          :editing="true"
          :modelValue="editingText"
          @edit="$emit('edit', { id: null, content: null })"
          @sendMessage="$emit('editMessage', $event)"
          @update:modelValue="$emit('editText', $event)"
        />
        <MessageActions
          v-if="(!search && isHovering) || (!search && avoid)"
          :avoid="avoid"
          :message="message"
          @avoid="avoid = $event"
          @delete="$emit('delete', { message, shifting: $event })"
          @edit="$emit('edit', { id: message.id, content: message.content })"
          @reply="$emit('reply', message)"
        ></MessageActions>
        <Embed
          v-for="(embed, index) in message.embeds"
          :key="index"
          :embed="embed"
        />
        <template v-slot:append>
          <div style="position: absolute; right: 10px; bottom: 0">
            <template
              v-for="(readReceipt, index) in message.readReceipts"
              :key="readReceipt.id"
            >
              <ReadReceipt
                v-if="index < renderableReadReceipts"
                :message="message"
                :read-receipt="readReceipt"
              />
            </template>
            <span
              v-if="message.readReceipts.length > renderableReadReceipts"
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
              +{{ message.readReceipts.length - renderableReadReceipts }}
            </span>
          </div>
        </template>
      </v-list-item>
    </v-hover>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";
import Embed from "@/components/Communications/Embed.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import ReadReceipt from "@/components/Communications/ReadReceipt.vue";

export default defineComponent({
  name: "Message",
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
    "editingText",
    "merge",
    "search",
    "pins",
    "dateSeparator"
  ],
  data() {
    return {
      avoid: false
    };
  },
  methods: {
    context(e: any) {
      e.preventDefault();
      this.$chat.dialogs.message.message = this.message;
      this.$chat.dialogs.message.x = e.clientX;
      this.$chat.dialogs.message.y = e.clientY;
      this.$chat.dialogs.message.value = true;
    }
  },
  computed: {
    renderableReadReceipts() {
      if (this.$vuetify.display.mobile) return 2;
      if (this.$vuetify.display.sm) return 10;
      if (this.$vuetify.display.md) return 10;
      if (this.$vuetify.display.xl) return 15;
      if (this.$vuetify.display.xxl) return 20;
      return 10;
    },
    mentions() {
      return !!this.message.content.includes(`<@${this.$user.user?.id}>`);
    }
  }
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
