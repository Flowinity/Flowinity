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
        messages: [message]
      }
    });
    await loadChatMessages(associationId);
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
    currentMessages
  };
});
