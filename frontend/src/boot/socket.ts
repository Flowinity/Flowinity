import { Chat } from "@/models/chat";
import { Message, Message as MessageType } from "@/models/message";
import MessageToast from "@/components/Communications/MessageToast.vue";
import router from "@/router";
import { User } from "@/models/user";
import { Friend } from "@/models/friend";
import { ChatAssociation } from "@/models/chatAssociation";
import { useChatStore } from "@/store/chat";
import { useFriendsStore } from "@/store/friends";
import { useUserStore } from "@/store/user";
import { useExperimentsStore } from "@/store/experiments";
import { useToast } from "vue-toastification";

function checkMessage(id: number, chatId: number) {
  const chat = useChatStore();
  const index = chat.chats.findIndex((c) => c.id === chatId);
  if (index === -1) return false;
  if (!chat.chats[index].messages) return false;
  return {
    index,
    messageIndex: chat.chats[index].messages.findIndex((m) => m.id === id)
  };
}

export default async function setup(app) {
  const socket = app.config.globalProperties.$socket;
  const chat = useChatStore();
  const friends = useFriendsStore();
  const user = useUserStore();
  const experiments = useExperimentsStore();
  const toast = useToast();

  socket.on("chatCreated", (newChat: Chat) => {
    chat.chats.unshift(newChat);
  });
  socket.on("chatChanged", (newChat: Chat) => {
    const index = chat.chats.findIndex((c) => c.id === newChat.id);
    if (index === -1) return;
    chat.chats[index] = newChat;
  });
  socket.on("chatDeleted", (chatId: number) => {
    const index = chat.chats.findIndex((c) => c.id === chatId);
    if (index === -1) return;
    chat.chats.splice(index, 1);
  });
  socket.on("message", async (newMessage: any) => {
    if (newMessage.chat.id === chat.selectedChat?.id && chat.isCommunications)
      return;
    const index = chat.chats.findIndex((c) => c.id === newMessage.chat.id);
    if (index === -1) return;
    // move chat to top
    const chatToMove = chat.chats[index];
    chat.chats.splice(index, 1);
    chat.chats.unshift(chatToMove);
    const newIndex = chat.chats.findIndex((c) => c.id === newMessage.chat.id);
    if (
      experiments.experiments.COMMUNICATIONS_KEEP_LOADED &&
      !chat.chats[newIndex].messages &&
      !chat.chats[newIndex].messages?.find(
        (m) => m.id === newMessage.message.id
      )
    ) {
      if (!chat.chats[newIndex]?.messages) chat.chats[newIndex].messages = [];
      chat.chats[newIndex].messages.unshift(newMessage.message as MessageType);
    }
    if (
      newMessage.message.userId === user.user?.id ||
      (chatToMove.association.notifications === "mentions" &&
        !newMessage.mention) ||
      chatToMove.association.notifications === "none"
    )
      return;
    chat.chats[newIndex].unread++;
    if (
      user.user?.storedStatus !== "busy" &&
      newMessage.message.userId !== user.user?.id
    ) {
      chat.sound();
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
            router.push("/communications/" + newMessage.association.id);
          }
        }
      );
    }
  });
  socket.on("userStatus", (data: User) => {
    const index = friends.friends.findIndex((f) => f.friendId === data.id);
    if (index === -1) {
      if (data.id === user.user?.id) {
        user.user = {
          ...user.user,
          status: data.status,
          platforms: data.platforms
        };
        return;
      } else {
        return;
      }
    }
    friends.friends[index].user.status = data.status;
  });
  socket.on("friendRequestAccepted", async (data: Friend) => {
    friends.friends.push(data);
    chat.sound();
  });
  socket.on(
    "edit",
    (data: {
      chatId: number;
      id: number;
      content: string;
      edited: boolean;
      editedAt: Date;
      userId: number;
      pinned: boolean;
    }) => {
      const message = checkMessage(data.id, data.chatId);
      if (!message) return;
      if (data.content) {
        chat.chats[message.index].messages[message.messageIndex].content =
          data.content;
      }
      if (data.edited !== undefined) {
        chat.chats[message.index].messages[message.messageIndex].edited =
          data.edited;
      }
      if (data.editedAt !== undefined) {
        chat.chats[message.index].messages[message.messageIndex].editedAt =
          data.editedAt;
      }
      if (data.pinned !== undefined) {
        chat.chats[message.index].messages[message.messageIndex].pinned =
          data.pinned;
      }
    }
  );
  socket.on("notification", async (data: any) => {
    user.user?.notifications.unshift(data);
    chat.sound();
  });
  socket.on("messageDelete", (data: { chatId: number; id: number }) => {
    const message = checkMessage(data.id, data.chatId);
    if (!message) return;
    chat.chats[message.index].messages.splice(message.messageIndex, 1);
  });
  socket.on("userSettingsUpdate", (data: any) => {
    user.user = {
      ...user.user,
      ...data
    };
    user.changes = {
      ...user.changes,
      ...data
    };
  });
  socket.on("chatUpdate", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    chat.chats[index] = {
      ...chat.chats[index],
      ...data
    };
  });
  socket.on("readReceipt", (data: ChatAssociation) => {
    const index = chat.chats.findIndex((c: Chat) => c.id === data.chatId);
    if (index === -1) return;
    if (!chat.chats[index].messages) return;
    const messageIndex = chat.chats[index].messages.findIndex(
      (m: MessageType) => m.id === data.id
    );
    if (messageIndex === -1) return;
    chat.chats[index].messages.forEach((message: Message) => {
      message.readReceipts = message.readReceipts.filter(
        (r: ChatAssociation) => r.user.id !== data.user.id
      );
    });
    chat.chats[index]?.messages[messageIndex].readReceipts.push(data);
  });
  socket.on("chatUserUpdate", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;
    const userIndex = chat.chats[index].users.findIndex(
      (u) => u.id === data.id
    );
    if (userIndex === -1) return;
    chat.chats[index].users[userIndex] = {
      ...chat.chats[index].users[userIndex],
      ...data
    };
  });
  socket.on("addChatUsers", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;
    chat.chats[index].users.push(...data.users);
  });
  socket.on("removeChatUser", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;
    const userIndex = chat.chats[index].users.findIndex(
      (u) => u.id === data.id
    );
    if (userIndex === -1) return;
    chat.chats[index].users.splice(userIndex, 1);
  });
  socket.on("removeChat", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    chat.chats.splice(index, 1);
    if (chat.selectedChat?.id === data.id && chat.isCommunications) {
      router.push("/communications/home");
    }
  });
  socket.on("autoCollectApproval", (data: { type: string }) => {
    if (!user.user) return;
    if (
      experiments.experiments["SFX_KFX"] ||
      experiments.experiments["SFX_KOLF"]
    ) {
      chat.sound();
    }

    if (data.type === "new") {
      user.user.pendingAutoCollects += 1;
    } else if (data.type === "approve" || data.type === "deny") {
      user.user.pendingAutoCollects -= 1;
    }
  });
  socket.on("readChat", (data: { id: number }) => {
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    chat.chats[index].unread = 0;
  });
  socket.on("friendNickname", (data: { id: number; nickname: string }) => {
    const index = friends.friends.findIndex((f) => f.friendId === data.id);
    if (index === -1) return;
    const friend = friends.friends[index];
    if (friend.user.nickname) {
      friend.user.nickname.nickname = data.nickname;
    } else {
      friend.user.nickname = {
        nickname: data.nickname,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 0,
        friendId: data.id,
        userId: user.user?.id || 0
      };
    }
  });
  socket.on("userNameColor", (data: { id: number; nameColor: string }) => {
    for (const c of chat.chats) {
      for (const user of c.users) {
        if (user.user?.id === data.id) {
          user.user.nameColor = data.nameColor;
        }
      }
    }
  });
}
