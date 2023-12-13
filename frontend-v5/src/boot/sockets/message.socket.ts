import { useChatStore } from "@/stores/chat.store";
import { useApolloClient, useSubscription } from "@vue/apollo-composable";
import { NewMessageSubscription } from "@/graphql/chats/subscriptions/newMessage.graphql";
import { Message, UserStoredStatus } from "@/gql/graphql";
import MessageToast from "@/components/Communications/MessageToast.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useMessagesStore } from "@/stores/messages.store";
import { useToast } from "vue-toastification";
import {
  CancelTypingSubscription,
  TypingSubscription
} from "@/graphql/chats/subscriptions/typing.graphql";
import { EmbedResolutionSubscription } from "@/graphql/chats/subscriptions/embedResolution.graphql";

export default function setup() {
  const chatStore = useChatStore();
  const router = useRouter();
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();
  const toast = useToast();

  const newMsg = useSubscription(NewMessageSubscription);

  newMsg.onResult(({ data: { newMessage } }) => {
    console.log("message");
    const index = chatStore.chats.findIndex(
      (c) => c.id === newMessage.message.chatId
    );
    if (index === -1) return;
    // move chat to top
    const chatToMove = chatStore.chats[index];
    chatStore.chats = [
      {
        ...chatToMove,
        unread:
          chatStore.selectedChat?.id === newMessage.message.chatId
            ? chatToMove.unread
            : (chatToMove.unread || 0) + 1
      },
      ...chatStore.chats.slice(0, index),
      ...chatStore.chats.slice(index + 1)
    ];
    const msgChat = chatStore.chats.find((c) => c.id === newMessage.chat.id);
    const assocId = msgChat?.association?.id || -1;
    if (
      assocId &&
      messagesStore.messages[assocId] &&
      !messagesStore.messages[assocId].find(
        (m) => m.id === newMessage.message.id
      )
    ) {
      const index = messagesStore.messages[assocId]?.findIndex(
        (msg) => msg.pending && msg.content === newMessage.message.content
      );
      if (index === -1) {
        messagesStore.messages[assocId].unshift(newMessage.message as Message);
      } else {
        messagesStore.messages[assocId].splice(index, 1);
        messagesStore.messages[assocId].unshift(newMessage.message);
      }

      if (
        document.hasFocus() &&
        chatStore.selectedChat?.id === newMessage.message.chatId
      ) {
        chatStore.readChat();
      }
    }
    if (
      newMessage.message.userId === userStore.user?.id ||
      (chatToMove.association?.notifications === "mentions" &&
        !newMessage.mention) ||
      chatToMove.association?.notifications === "none"
    )
      return;
    if (
      userStore.user?.storedStatus !== UserStoredStatus.Busy &&
      newMessage.message.userId !== userStore.user?.id
    ) {
      messagesStore.sound();
      toast.info(
        {
          component: MessageToast,
          props: {
            message: newMessage.message
          }
        },
        {
          toastClassName: "message-toast",
          icon: false,
          onClick: () => {
            router.push("/communications/" + newMessage.associationId);
          }
        }
      );
    }
  });

  const typing = useSubscription(TypingSubscription);
  const cancelTyping = useSubscription(CancelTypingSubscription);

  typing.onResult(({ data: { typingEvent } }) => {
    const index = chatStore.typers.findIndex(
      (t) => t.chatId === typingEvent.chatId && t.userId === typingEvent.user.id
    );
    if (index !== -1) {
      const val = chatStore.typers.find(
        (t) =>
          t.chatId === typingEvent.chatId && t.userId === typingEvent.user.id
      );
      clearTimeout(val?.timeout);
      chatStore.typers.splice(index, 1);
    }
    chatStore.typers.push({
      chatId: typingEvent.chatId,
      userId: typingEvent.user.id,
      expires: typingEvent.expires,
      timeout: setTimeout(
        () => {
          const index = chatStore.typers.findIndex(
            (t) =>
              t.chatId === typingEvent.chatId &&
              t.userId === typingEvent.user.id
          );
          if (index !== -1) {
            chatStore.typers.splice(index, 1);
          }
        },
        new Date(typingEvent.expires).getTime() - Date.now()
      )
    });
  });

  cancelTyping.onResult(({ data: { cancelTypingEvent } }) => {
    const index = chatStore.typers.findIndex(
      (t) =>
        t.chatId === cancelTypingEvent.chatId &&
        t.userId === cancelTypingEvent.user.id
    );
    if (index !== -1) {
      const val = chatStore.typers.find(
        (t) =>
          t.chatId === cancelTypingEvent.chatId &&
          t.userId === cancelTypingEvent.user.id
      );
      clearTimeout(val?.timeout);
      chatStore.typers.splice(index, 1);
    }
  });

  const embedResolution = useSubscription(EmbedResolutionSubscription);

  embedResolution.onResult(({ data: { embedResolution } }) => {
    const index = messagesStore.messages[
      embedResolution.associationId
    ]?.findIndex((msg) => msg.id === embedResolution.message.id);
    console.log(embedResolution);
    if (index !== -1) {
      console.log(messagesStore.messages[embedResolution.associationId]);
      const message =
        messagesStore.messages[embedResolution.associationId][index];
      messagesStore.messages[embedResolution.associationId].splice(index, 1, {
        ...message,
        embeds: embedResolution.message.embeds
      });
    }
  });
}
