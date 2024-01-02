import { computed, type ComputedRef, ref } from "vue";
import { defineStore } from "pinia";
import type {
  InfiniteMessagesInput,
  Message,
  PagedMessagesInput
} from "@/gql/graphql";
import {
  MessagesQuery,
  PagedMessagesQuery
} from "@/graphql/chats/messages.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { SendMessageMutation } from "@/graphql/chats/sendMessage.graphql";
import { useExperimentsStore } from "@/stores/experiments.store";
import { useChatStore } from "@/stores/chat.store";
import { DeleteMessageMutation } from "@/graphql/chats/deleteMessage.graphql";

export const useMessagesStore = defineStore("messages", () => {
  /** @var associationId
   * @var message[] */
  const messages = ref<Record<number, Message[]>>({});

  const { resolveClient } = useApolloClient();
  const client = resolveClient();
  const chatStore = useChatStore();

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

  async function sendMessage(
    content: string,
    attachments: string[] = [],
    replyId?: number,
    associationId?: number
  ) {
    await client.mutate({
      mutation: SendMessageMutation,
      variables: {
        input: {
          content,
          attachments: attachments.filter((attachment) => attachment),
          replyId,
          associationId:
            associationId || chatStore.selectedChat?.association?.id
        }
      }
    });
  }

  async function sound() {
    const experiments = useExperimentsStore();
    let sound;
    const id = experiments.experiments.NOTIFICATION_SOUND;
    if (id === 3) {
      sound = await import("@/assets/audio/kfx.wav");
    } else if (id === 2) {
      sound = await import("@/assets/audio/notification.wav");
    } else {
      sound = await import("@/assets/audio/notification.wav");
    }
    const audio = new Audio(sound.default);
    await audio.play();
  }

  const selected: ComputedRef<Message[]> = computed(() => {
    return messages.value[chatStore.selectedChatAssociationId] || [];
  });

  async function deleteMessage(messageId: number, associationId?: number) {
    await client.mutate({
      mutation: DeleteMessageMutation,
      variables: {
        input: {
          messageId,
          associationId: associationId || chatStore.selectedChatAssociationId
        }
      }
    });
  }

  return {
    messages,
    sound,
    getMessages,
    sendMessage,
    selected,
    deleteMessage
  };
});
