import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  InfiniteMessagesInput,
  Message,
  MessageType,
  MessagesDocument,
  MessagesQuery,
  PagedMessagesDocument,
  PagedMessagesInput,
  PagedMessagesQuery,
  ScrollPosition
} from "@/gql/graphql";
import { useChatStore } from "@/store/chat.store";
import { useApolloClient } from "@vue/apollo-composable";
import { updateCache } from "@/utils/cacheManager";
import { useUserStore } from "./user.store";

export const useMessagesStore = defineStore("messages", () => {
  /**
   * Record<ChatAssociationId, Message[]>
   */
  const messages = ref<Record<number, MessagesQuery["messages"]>>({});
  const chatStore = useChatStore();

  const currentMessages = computed(() => {
    return messages.value[chatStore.selectedChatId];
  });

  async function getMessages(
    input: InfiniteMessagesInput
  ): Promise<MessagesQuery["messages"]> {
    const apolloClient = useApolloClient();
    const { data } = await apolloClient.client.query({
      query: MessagesDocument,
      variables: {
        input
      }
    });
    console.log(`GETTING`, data, input);

    return data.messages;
  }

  async function getPagedMessages(
    input: PagedMessagesInput
  ): Promise<PagedMessagesQuery["messagesPaged"]> {
    const apolloClient = useApolloClient();
    const { data } = await apolloClient.client.query({
      query: PagedMessagesDocument,
      variables: {
        input
      }
    });

    return data.messagesPaged;
  }

  /**
   * Insert a message or messages into the store and cache
   * @param {Message | Message[]} message
   * @param {number} associationId
   * @param {boolean} replace Replace the pending message if it exists
   */
  async function insertMessage(
    message: MessagesQuery["messages"][0],
    associationId: number
  ): Promise<void> {
    console.log(`INSERTING`, message, associationId);
    if (!message || !associationId) {
      console.warn(
        "[Flowinity/Messages] Tried to insert message without message or associationId",
        {
          message,
          associationId
        }
      );
      return;
    }
    if (!messages.value[associationId]) {
      console.warn(
        "[Flowinity/Messages] Tried to insert message into non-existing chat. It's likely it's not loaded therefore we don't need to insert it.",
        {
          associationId
        }
      );
      return;
    }

    const apolloClient = useApolloClient();
    const pendingMessage = messages.value[associationId].find(
      (m) => m.content === message.content && m.pending
    );
    const messagesToInsert = messages.value[associationId].filter(
      (m) => m.id !== pendingMessage?.id
    );
    if (pendingMessage)
      apolloClient.client.cache.evict({
        id: `Message:${pendingMessage.id}`
      });
    apolloClient.client.cache.writeQuery({
      query: MessagesDocument,
      variables: {
        input: {
          associationId: associationId,
          limit: 50,
          position: ScrollPosition.Top
        }
      },
      data: {
        messages: [message, ...messagesToInsert]
      }
    });
    if (message.chatId === chatStore.selectedChatId)
      await loadChatMessages(associationId);
  }

  async function updateMessage(message: Message) {
    const cache = useApolloClient().client.cache;
    cache.modify({
      id: `Message:${message.id}`,
      fields: {
        content: () => message.content,
        updatedAt: () => message.updatedAt,
        type: () => message.type,
        edited: () => message.edited,
        embeds: () => message.embeds,
        pinned: () => message.pinned,
        editedAt: () => message.editedAt,
        readReceipts: () => message.readReceipts,
        error: () => message.error,
        pending: () => message.pending
      }
    });
    if (message.chatId === chatStore.selectedChatId)
      await loadChatMessages(message.chatId);
  }

  async function loadChatMessages(associationId?: number) {
    const data = await getMessages({
      associationId: associationId || chatStore.selectedChatId,
      limit: 50,
      position: ScrollPosition.Top
    });
    console.log(`LOADING`, data, associationId);
    messages.value[associationId || chatStore.selectedChatId] = data;
  }

  return {
    messages,
    getMessages,
    getPagedMessages,
    insertMessage,
    loadChatMessages,
    currentMessages,
    updateMessage
  };
});
