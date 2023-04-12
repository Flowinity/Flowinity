<template>
  <div class="position-relative">
    <div
      v-if="dateSeparator"
      style="
        text-align: center;
        position: relative;
        height: 27.5px;
        display: flex;
        justify-content: center;
      "
    >
      <div
        style="
          border-bottom: 1px solid rgb(33, 36, 37);
          position: absolute;
          top: 0;
          width: 100%;
          height: calc(50% - 3px);
        "
      ></div>
      <p
        class="text-grey"
        style="
          background-color: rgb(var(--v-theme-background));
          position: absolute;
          height: 20px;
          padding-left: 10px;
          padding-right: 10px;
        "
      >
        {{ $date(message.createdAt).format("ddd, Do of MMMM YYYY") }}
      </p>
    </div>
    <v-toolbar
      height="auto"
      v-if="message.reply"
      color="transparent"
      floating
      class="ml-6 my-1 pointer limit"
      @click.prevent="$emit('jumpToMessage', message.reply.id)"
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
    <v-hover v-slot="{ isHovering, props }">
      <v-list-item
        color="transparent"
        class="message rounded-0"
        :class="{ merge, 'message-mention': mentions }"
        @contextmenu="context"
        v-bind="props"
      >
        <v-btn
          style="position: absolute; right: 0"
          class="mr-2 mt-2 text-grey"
          icon
          size="x-small"
          v-if="
            $chat.selectedChat?.association.rank &&
            ['admin', 'owner'].includes($chat.selectedChat?.association.rank) &&
            pins
          "
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
              style="align-items: start !important; display: flex"
              v-if="!message.type || message.type === 'message'"
              @click.prevent="
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
              style="font-size: 9px"
              :style="mentions ? 'margin-right: 1.9em' : 'margin-right: 2.30em'"
              class="text-grey message-date"
              v-if="merge"
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
              color="grey"
              icon
              size="x-small"
              class="ml-3"
              style="display: inline-block"
            >
              mdi-pencil
            </v-icon>
          </span>
        </p>
        <span
          v-if="!editing && message.content"
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
              color="grey"
              icon
              size="x-small"
              class="ml-3"
              style="display: inline-block"
            >
              mdi-pencil
            </v-icon>
          </span>
        </span>
        <CommunicationsInput
          @edit="$emit('edit', { id: null, content: null })"
          v-else-if="editing"
          :modelValue="editingText"
          @update:modelValue="$emit('editText', $event)"
          :editing="true"
          @sendMessage="$emit('editMessage', $event)"
        />
        <MessageActions
          @edit="$emit('edit', { id: message.id, content: message.content })"
          :message="message"
          @reply="$emit('reply', message)"
          @delete="$emit('delete', { message, shifting: $event })"
          v-if="(!search && isHovering) || (!search && avoid)"
          @avoid="avoid = $event"
          :avoid="avoid"
        ></MessageActions>
        <Embed
          v-for="(embed, index) in message.embeds"
          :embed="embed"
          :key="index"
        />
        <template v-slot:append>
          <div style="position: absolute; right: 10px; bottom: 0">
            <template
              v-for="(readReceipt, index) in message.readReceipts"
              :key="readReceipt.id"
            >
              <ReadReceipt
                :message="message"
                :read-receipt="readReceipt"
                v-if="index < renderableReadReceipts"
              />
            </template>
            <span
              class="text-grey ml-1 mr-2"
              v-if="message.readReceipts.length > renderableReadReceipts"
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
import CommunicationsAvatar from "@/components/Communications/CommunicationsAvatar.vue";
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
    CommunicationsAvatar,
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
