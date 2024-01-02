<template>
  <div class="flex-col items-center">
    <message-reply :reply="message.reply" class="ml-9 items-center mt-2" />
    <div
      v-bind="$attrs"
      :ref="`message-${message.id}`"
      class="message hover-message-actions flex"
      :class="{
        'mt-2': !merge && !message.reply,
        'mt-1': message.reply
      }"
      @mouseenter="hovered = true"
    >
      <div
        class="flex w-full flex-grow basis-0 message-main relative rounded-l"
      >
        <div class="avatar-section" :class="{ 'justify-center': merge }">
          <UserAvatar
            v-if="!merge"
            :user-id="message.userId || 0"
            :username="message.user?.username"
          />
          <p
            v-else
            style="font-size: 10px"
            class="text-medium-emphasis-dark merge-date"
          >
            {{ $date(message.createdAt).format("hh:mm A") }}
          </p>
        </div>
        <div class="flex-col w-full">
          <div
            v-if="!merge"
            class="flex items-center"
            :style="{
              color: chatStore.getColor(
                chatStore.selectedChat?.users.find(
                  (assoc) => assoc.userId === message.userId
                )?.ranksMap || [],
                chatStore.selectedChat?.ranks || []
              )
            }"
          >
            {{ friendsStore.getName(message.userId) }}
            <p class="text-medium-emphasis-dark text-sm ml-2">
              {{ dayjs(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
            </p>
          </div>
          <div class="relative w-full pr-5 inline-block gap-1">
            <span
              v-memo="[message.content, message.error, message.pending]"
              class="overflow-content"
              :class="{
                'text-medium-emphasis-dark': message.pending,
                'text-red': message.error
              }"
              v-html="$functions.markdown(message.content || '', message)"
              v-if="!editing"
            ></span>
            <span
              v-if="!editing && message.edited"
              class="fill-medium-emphasis-dark inline-block"
            >
              <RiPencilFill style="width: 20px" />
            </span>
            <comms-input
              v-if="editing"
              class="m-2 w-full"
              editing
              v-model="editingText"
              :placeholder="$t('communications.message.editing')"
              @keydown.esc="$emit('update:editing', false)"
              autofocus
              @send="editMessage()"
              id="editing-message-input"
              @keydown.enter="editMessage()"
            >
              <template #append="{ emit }">
                <div class="flex gap-2">
                  <div
                    style="width: 25px"
                    class="cursor-pointer"
                    v-tooltip.top="t('chats.input.send')"
                    @click="emit('send')"
                  >
                    <RiCloseCircleFill style="width: 100%; height: 100%" />
                  </div>
                  <div
                    style="width: 25px"
                    class="cursor-pointer"
                    v-tooltip.top="t('chats.input.send')"
                    @click="emit('send')"
                  >
                    <RiSendPlane2Fill style="width: 100%; height: 100%" />
                  </div>
                </div>
              </template>
            </comms-input>
            <div class="pl-2 text-sm text-medium-emphasis-dark" v-if="editing">
              {{ t("chats.input.editingHelper") }}
            </div>
          </div>
          <div class="flex-col flex">
            <comms-message-embed
              v-for="embed in message.embeds"
              :key="embed"
              :embed="embed"
            />
          </div>
        </div>
        <comms-message-actions
          v-if="hovered && !editing"
          @reply="$emit('reply', message.id)"
          @pin="editMessage($event)"
          @edit="$emit('update:editing', message.id)"
          :message="message"
        ></comms-message-actions>
      </div>
      <div
        v-if="!search"
        class="flex-shrink-1 justify-end align-bottom relative align-self-end flex flex-col items-end"
        style="width: 100px"
      >
        <div
          class="flex align-bottom"
          :class="{ 'read-receipt-avatars': message.readReceipts.length > 3 }"
        >
          <user-avatar
            v-for="readReceipt in message.readReceipts"
            :key="readReceipt.id"
            v-tooltip="userStore.users[readReceipt.user?.id || 0]?.username"
            :user-id="readReceipt.user?.id || 0"
            :class="{ 'ml-1': message.readReceipts.length <= 3 }"
            size="22"
            class="read-receipt-avatar"
          ></user-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "@/gql/graphql";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useUserStore } from "@/stores/user.store";
import { useFriendsStore } from "@/stores/friends.store";
import dayjs from "../../plugins/dayjs";
import CommsMessageActions from "@/components/Communications/CommsMessageActions.vue";
import { onMounted, ref, watch } from "vue";
import MessageReply from "@/components/Communications/MessageReply.vue";
import CommsMessageEmbed from "@/components/Communications/CommsMessageEmbed.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import CommsInput from "@/components/Communications/CommsInput.vue";
import RiSendPlane2Fill from "vue-remix-icons/icons/ri-send-plane-2-fill.vue";
import { useI18n } from "vue-i18n";

const hovered = ref(false);
const friendsStore = useFriendsStore();
const userStore = useUserStore();
const messagesStore = useMessagesStore();
const { t } = useI18n();
import RiCloseCircleFill from "vue-remix-icons/icons/ri-close-circle-fill.vue";
import { useChatStore } from "@/stores/chat.store";
import { useApolloClient } from "@vue/apollo-composable";
import { EditMessageMutation } from "@/graphql/chats/editMessage.graphql";
import RiPencilFill from "vue-remix-icons/icons/ri-pencil-fill.vue";
import { useMessagesStore } from "@/stores/messages.store";
const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true
  },
  dateSeparator: {
    type: Boolean
  },
  mentions: {
    type: Boolean
  },
  editing: {
    type: Boolean
  },
  merge: {
    type: Boolean
  },
  search: {
    type: Boolean
  }
});

const editingText = ref<undefined | string>(undefined);

const chatStore = useChatStore();

const emit = defineEmits(["reply", "autoScroll", "update:editing"]);

function blocked(userId?: number) {
  return userStore.blocked.find(
    (block) => block.blockedUserId === userId ?? props.message.userId
  );
}

onMounted(() => {});

async function editMessage(pinned?: boolean) {
  emit("update:editing", false);

  if (pinned === undefined && !editingText.value) {
    return messagesStore.deleteMessage(props.message.id);
  }

  await useApolloClient().client.mutate({
    mutation: EditMessageMutation,
    variables: {
      input: {
        messageId: props.message.id,
        content: editingText.value,
        associationId: chatStore.selectedChatAssociationId,
        embeds: [],
        attachments: [],
        pinned
      }
    }
  });
}

watch(
  () => [props.message?.embeds, props.message?.content],
  () => {
    emit("autoScroll");
  },
  {
    deep: true
  }
);

watch(
  () => props.editing,
  (editing) => {
    if (editing) {
      editingText.value = props.message.content!;
    }
  }
);
</script>

<style scoped>
.merge-date {
  display: none;
}
.hover-message-actions:hover .merge-date {
  display: block;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  min-width: 60px;
  padding: 4px;
}
</style>

<style>
.message-actions {
  display: none;
}

.hover-message-actions:hover .message-actions,
.message-actions:hover {
  display: block;
  z-index: 999;
}

.message a {
  color: #0190ea;
}
.overflow-content * {
  white-space: pre-line !important;
  overflow-wrap: anywhere !important;
}

.hover-message-actions:hover .message-main {
  @apply bg-card-secondary-dark;
}

.communications .read-receipt-avatars .read-receipt-avatar {
  margin-left: -4px !important;
}
</style>
