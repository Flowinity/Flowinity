import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type {
  Chat,
  ChatEmoji,
  InfiniteMessagesInput,
  Message,
  PagedMessagesInput
} from "@/gql/graphql";
import { MessageType, ScrollPosition } from "@/gql/graphql";
import { useFriendsStore } from "@/stores/friends.store";
import { useUserStore } from "@/stores/user.store";
import dayjs from "@/plugins/dayjs";
import {
  MessagesQuery,
  PagedMessagesQuery
} from "@/graphql/chats/messages.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { useAppStore } from "@/stores/app.store";
import { useSocket } from "@/boot/socket.service";
import { useRoute, useRouter } from "vue-router";

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([]);
  const selectedChatAssociationId = ref(0);
  const selectedChat = computed(() => {
    return chats.value.find(
      (chat) => chat.association?.id === selectedChatAssociationId.value
    );
  });
  const trustedDomains = ref<string[]>([]);
  const drafts = ref<Record<number, string>>({});
  const emoji = ref<ChatEmoji[]>([]);
  const recentEmoji = ref<Record<string, number>>({});
  const loading = ref(false);
  const isReady = ref(0);

  function chatName(chat: Chat) {
    if (!chat) return "Communications";
    if (chat.type === "direct") {
      return useFriendsStore().getName(chat?.recipient) || "Deleted User";
    } else {
      const userStore = useUserStore();
      const friendStore = useFriendsStore();
      if (chat.name === "Unnamed Group") {
        const users = chat.users
          .filter((user) => user.userId !== userStore.user?.id)
          .map(
            (user) =>
              friendStore.getName(userStore.users[user.userId]) ||
              "Deleted User"
          );

        const limitedUsers = users.slice(0, 3); // Get the first 3 users

        const remainingUsersCount = Math.max(0, users.length - 3); // Calculate the remaining users count

        return `${limitedUsers.join(", ")}${
          remainingUsersCount > 0 ? `, +${remainingUsersCount} others` : ""
        }`;
      }
      return chat.name;
    }
  }

  async function init() {
    try {
      const chatsLocal = localStorage.getItem("chatStore");
      if (chatsLocal) {
        chats.value = JSON.parse(chatsLocal).sort((a: Chat, b: Chat) => {
          return (
            Number(b._redisSortDate) - Number(a._redisSortDate) ||
            Number(b.id) - Number(a.id)
          );
        });
      }
    } catch {
      //
    }
    try {
      const trustedDomains = localStorage.getItem("trustedDomainsStore");
      if (trustedDomains) {
        this.trustedDomains = JSON.parse(trustedDomains);
      }
    } catch {
      //
    }
    try {
      const drafts = localStorage.getItem("draftStore");
      if (drafts) {
        this.drafts = JSON.parse(drafts);
      }
    } catch {
      //
    }
    try {
      const emoji = localStorage.getItem("emojiStore");
      if (emoji) {
        this.recentEmoji = JSON.parse(emoji);
      }
    } catch {
      //
    }
  }

  function merge(message: Message, index: number) {
    if (message.replyId) return false;
    if (message.type !== MessageType.Message && message.type) return false;
    const prev = selectedChat.value?.messages[index + 1];
    if (!prev) return false;
    if (prev.type !== MessageType.Message && prev.type) return false;
    if (dayjs(message.createdAt).diff(prev.createdAt, "minutes") > 5)
      return false;
    return prev.userId === message.userId;
  }

  const { resolveClient } = useApolloClient();
  const client = resolveClient();

  async function getMessages(
    input: InfiniteMessagesInput | PagedMessagesInput
  ): Promise<Message[]> {
    const { data } = await client.query({
      query: "page" in input ? PagedMessagesQuery : MessagesQuery,
      variables: {
        input
      },
      fetchPolicy: "network-only"
    });

    return "page" in input
      ? structuredClone(data.messagesPaged)
      : structuredClone(data.messages);
  }

  async function setChat(id: number) {
    loading.value = true;
    selectedChatAssociationId.value = id;
    const appStore = useAppStore();
    appStore.title = chatName(selectedChat.value?.id);
    const messages = await getMessages({
      associationId: id,
      position: ScrollPosition.Top
    });
    if (id !== selectedChatAssociationId.value) return;
    const index = chats.value.findIndex(
      (chat: Chat) => chat.association?.id === id
    );
    chats.value[index] = {
      ...(chats.value.find(
        (chat: Chat) => chat.association?.id === id
      ) as Chat),
      messages,
      unread: 0
    };
    readChat();
    isReady.value = id;
    loading.value = false;
  }

  function readChat(chatId?: number) {
    if (document.hasFocus()) {
      useSocket.chat.emit(
        "readChat",
        chatId || selectedChatAssociationId.value
      );
      if (selectedChat.value) selectedChat.value.unread = 0;
    }
  }

  const route = useRoute();
  watch(
    () => route.path,
    (val) => {
      if (!val.startsWith("/communications/") || !route.params.id) return;
      setChat(parseInt(<string>route.params.id));
    }
  );

  return {
    chats,
    selectedChatAssociationId,
    selectedChat,
    init,
    trustedDomains,
    drafts,
    emoji,
    recentEmoji,
    chatName,
    merge,
    readChat,
    setChat
  };
});
