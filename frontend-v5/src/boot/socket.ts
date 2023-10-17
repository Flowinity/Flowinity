import MessageToast from "@/components/Communications/MessageToast.vue";
import router from "@/router";
import { useChatStore } from "@/stores/chat.store";
import { useFriendsStore } from "@/stores/friends.store";
import { useUserStore } from "@/stores/user.store";
import { useExperimentsStore } from "@/stores/experiments.store";
import { useToast } from "vue-toastification";
import type {
  AddRank,
  BlockedUser,
  Chat,
  ChatAssociation,
  ChatEmoji,
  ChatRank,
  Friend,
  FriendNickname,
  FriendStatus,
  Message,
  PartialUserFriend,
  User
} from "@/gql/graphql";
import { UserStoredStatus } from "@/gql/graphql";
import emojiData from "markdown-it-emoji/lib/data/full.json";
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
  const sockets = app.config.globalProperties.$sockets;
  const chat = useChatStore();
  const friends = useFriendsStore();
  const user = useUserStore();
  const experiments = useExperimentsStore();
  const toast = useToast();

  sockets.chat.on("chatCreated", (newChat: Chat) => {
    chat.chats.unshift(newChat);
  });
  sockets.chat.on("chatChanged", (newChat: Chat) => {
    const index = chat.chats.findIndex((c) => c.id === newChat.id);
    if (index === -1) return;
    chat.chats[index] = newChat;
  });
  sockets.chat.on("chatDeleted", (chatId: number) => {
    const index = chat.chats.findIndex((c) => c.id === chatId);
    if (index === -1) return;
    chat.chats.splice(index, 1);
  });
  sockets.chat.on("message", async (newMessage: any) => {
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
      chat.chats[newIndex].messages.unshift(newMessage.message as Message);
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
      user.user?.storedStatus !== UserStoredStatus.Busy &&
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
            router.push("/communications/" + newMessage.associationId);
          }
        }
      );
    }
  });
  sockets.trackedUsers.on("userStatus", (data: User) => {
    const index = user.tracked.findIndex((f) => f.id === data.id);
    if (index === -1) {
      if (data.id === user.user?.id) {
        user.user = {
          ...user.user,
          status: data.status
        };
        return;
      } else {
        return;
      }
    }
    user.tracked[index] = {
      ...user.tracked[index],
      status: data.status
    };
  });
  sockets.trackedUsers.on("trackedUsers", (data: PartialUserFriend[]) => {
    user.tracked = data;
  });
  sockets.chat.on("friendRequestAccepted", async (data: Friend) => {
    friends.friends.push(data);
    chat.sound();
  });
  sockets.chat.on(
    "edit",
    (data: {
      chatId: number;
      id: number;
      content: string;
      edited: boolean;
      editedAt: Date;
      userId: number;
      pinned: boolean;
      emoji?: ChatEmoji[];
    }) => {
      const message = checkMessage(data.id, data.chatId);
      if (!message) return;
      if (data.content) {
        chat.chats[message.index].messages[message.messageIndex].content =
          data.content;
      }
      if (data.emoji) {
        chat.chats[message.index].messages[message.messageIndex].emoji =
          data.emoji;
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
  sockets.user.on("notification", async (data: any) => {
    user.user?.notifications.unshift(data);
    chat.sound();
  });
  sockets.chat.on("messageDelete", (data: { chatId: number; id: number }) => {
    const message = checkMessage(data.id, data.chatId);
    if (!message) return;
    chat.chats[message.index].messages.splice(message.messageIndex, 1);
  });
  sockets.user.on("userSettingsUpdate", (data: any) => {
    user.user = {
      ...user.user,
      ...data
    };
  });
  sockets.chat.on("chatUpdate", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    chat.chats[index] = {
      ...chat.chats[index],
      ...data
    };
  });
  sockets.chat.on("readReceipt", (data: ChatAssociation) => {
    const index = chat.chats.findIndex((c: Chat) => c.id === data.chatId);
    if (index === -1) return;
    if (!chat.chats[index].messages) return;
    const messageIndex = chat.chats[index].messages.findIndex(
      (m: Message) => m.id === data.id
    );
    if (messageIndex === -1) return;
    chat.chats[index].messages.forEach((message: Message) => {
      message.readReceipts = message.readReceipts.filter(
        (r: ChatAssociation) => r.userId !== data.userId
      );
    });
    chat.chats[index]?.messages[messageIndex].readReceipts.push(data);
  });
  sockets.chat.on("chatUserUpdate", (data: any) => {
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
  sockets.chat.on("addChatUsers", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;
    for (const user of data.users) {
      if (chat.chats[index].users.find((u) => u.userId === user.id)) return;
      chat.chats[index].users.push(...data.users);
    }
  });
  sockets.chat.on("removeChatUser", (data: any) => {
    const index = chat.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;
    const userIndex = chat.chats[index].users.findIndex(
      (u) => u.id === data.id
    );
    if (userIndex === -1) return;
    chat.chats[index].users.splice(userIndex, 1);
  });
  sockets.chat.on("removeChat", (data: any) => {
    if (chat.selectedChat?.id === data.id && chat.isCommunications) {
      router.push("/communications/home");
    }
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    if (chat.dialogs.groupSettings.itemId === data.id) {
      chat.dialogs.groupSettings.value = false;
      chat.dialogs.groupSettings.itemId = undefined;
    }
    chat.chats.splice(index, 1);
  });
  sockets.autoCollects.on("autoCollectApproval", (data: { type: string }) => {
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
  sockets.chat.on("readChat", (data: { id: number }) => {
    const index = chat.chats.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    chat.chats[index].unread = 0;
  });
  sockets.friends.on("friendNickname", (data: FriendNickname) => {
    const index = user.tracked.findIndex((f) => f.id === data.friendId);
    if (index === -1) return;
    const friend = user.tracked[index];
    console.log(friend);
    if (friend.nickname) {
      friend.nickname.nickname = data.nickname;
    } else {
      friend.nickname = data;
    }
    const index1 = friends.friends.findIndex(
      (f) => f.friendId === data.friendId
    );
    if (index1 === -1) return;
    const friend1 = friends.friends[index];
    if (friend1.otherUser.nickname) {
      friend1.otherUser.nickname.nickname = data.nickname;
    } else {
      friend1.otherUser.nickname = data;
    }
  });
  // TODO: do something about name colors
  /*sockets.trackedUsers.on(
    "userNameColor",
    (data: { id: number; nameColor: string }) => {
      for (const c of chat.chats) {
        for (const user of c.users) {
          if (user.user?.id === data.id) {
            user.user.nameColor = data.nameColor;
          }
        }
      }
    }
  );*/
  sockets.chat.on("rankRemoved", (data: AddRank & { chatId: number }) => {
    const index = chat.chats.findIndex((chat) => {
      return chat.id === data.chatId;
    });
    if (index === -1) return;
    const userAssociation = chat.chats[index].users.find(
      (assoc) => assoc.id === data.updatingChatAssociationId
    );
    if (!userAssociation) return;
    const rankIndex = userAssociation.ranksMap.indexOf(data.rankId);
    if (rankIndex === -1) return;
    userAssociation.ranksMap.splice(rankIndex, 1);
  });
  sockets.chat.on("rankAdded", (data: AddRank & { chatId: number }) => {
    const index = chat.chats.findIndex((chat) => {
      return chat.id === data.chatId;
    });
    if (index === -1) return;
    const assocIndex = chat.chats[index].users.findIndex(
      (assoc) => assoc.id === data.updatingChatAssociationId
    );
    if (assocIndex === -1) return;
    const rankIndex = chat.chats[index].users[assocIndex].ranksMap.indexOf(
      data.rankId
    );
    if (rankIndex !== -1) return;
    chat.chats[index].users[assocIndex].ranksMap.push(data.rankId);

    const chatRanks = chat.chats[index].ranks;
    const rankMap = new Map(chatRanks.map((rank) => [rank.id, rank]));

    chat.chats[index].users[assocIndex].ranksMap = chat.chats[index].users[
      assocIndex
    ].ranksMap.sort((a, b) => {
      const rankA = rankMap.get(a);
      const rankB = rankMap.get(b);

      if (rankA && rankB) {
        return rankB.index - rankA.index;
      }

      return 0;
    });
  });
  sockets.chat.on(
    "syncPermissions",
    (data: {
      permissions: string[];
      associationId: number;
      userId: number;
    }) => {
      chat.chats.find(
        (chat) => chat.association.id === data.associationId
      ).association.permissions = data.permissions;
    }
  );
  sockets.chat.on("rankUpdated", (data: ChatRank) => {
    const localChat = chat.chats.find((chat) => chat.id === data.chatId);
    const rankIndex = localChat.ranks.findIndex((rank) => rank.id === data.id);
    if (rankIndex === -1) {
      localChat.ranks.push(data);
    } else {
      localChat.ranks[rankIndex] = data;
    }

    localChat.ranks.sort((a, b) => {
      return b.index - a.index || 0;
    });
  });
  sockets.chat.on(
    "rankOrderUpdated",
    (data: { chatId: number; ranks: Partial<ChatRank>[] }) => {
      const localChat = chat.chats.find((chat) => chat.id === data.chatId);
      localChat.ranks = localChat.ranks.map((rank) => {
        return {
          ...rank,
          index: data.ranks.find((r2) => r2.id === rank.id).index
        };
      });
      localChat.ranks.sort((a, b) => {
        return b.index - a.index || 0;
      });
    }
  );
  sockets.trackedUsers.on(
    "userBlocked",
    (data: { userId: number; blocked: boolean }) => {
      const u = user.tracked.find((user) => {
        return user.id === data.userId;
      });
      u.blocked = data.blocked;
    }
  );
  sockets.user.on(
    "userBlocked",
    (
      data:
        | (BlockedUser & { blocked: boolean })
        | { blockedUserId: number; blocked: boolean }
    ) => {
      if ("id" in data && data.blocked) {
        delete data.blocked;
        user.blocked.push(data);
      } else {
        user.blocked = user.blocked.filter(
          (block) => block.blockedUserId !== data.blockedUserId
        );
      }
    }
  );
  sockets.friends.on(
    "request",
    (data: {
      id: number;
      status: FriendStatus & "REMOVED";
      friend: Friend | null;
    }) => {
      if (data.status === "REMOVED") {
        friends.friends = friends.friends.filter(
          (friend) => friend.friendId !== data.id
        );
      } else if (
        data.status === FriendStatus.Incoming ||
        data.status === FriendStatus.Outgoing
      ) {
        friends.friends.push(data.friend);
      } else {
        const friend = friends.friends.find(
          (friend) => friend.id === data.friend.id
        );
        if (!friend) return;
        friend.status = FriendStatus.Accepted;
      }
    }
  );
  function handleDuplicates() {
    // Handle duplicate names, this system will append ~offset onto them
    // For example, the oldest smiley will be :smiley: but subsequent will be
    // :smiley~1: / :smiley~2: / etc
    const emojiNameCount: Record<string, number> = {};

    for (const e of Object.keys(emojiData)) {
      emojiNameCount[e] = (emojiNameCount[e] || 0) + 1;
    }

    for (const e of chat.emoji) {
      const emojiName = e.name;

      if (emojiNameCount.hasOwnProperty(emojiName)) {
        emojiNameCount[emojiName]++;

        e.name = `${emojiName}~${emojiNameCount[emojiName]}`;
      } else {
        emojiNameCount[emojiName] = 0;
      }
    }
  }
  sockets.chat.on("emojiCreated", (data: ChatEmoji) => {
    chat.emoji.push(data);
    handleDuplicates();
  });
  sockets.chat.on("emojiUpdated", (data: Partial<ChatEmoji>) => {
    const emoji = chat.emoji.find((emoji) => emoji.id === data.id);
    if (emoji) {
      emoji.name = data.name;
    }
    handleDuplicates();
  });
  sockets.chat.on("emojiDeleted", (data: { id: string }) => {
    chat.emoji = chat.emoji.filter((emoji) => emoji.id !== data.id);
    handleDuplicates();
  });
  sockets.chat.on("rankDeleted", (data: { id: string; chatId: number }) => {
    const targetedChat = chat.chats.find((chat) => chat.id === data.chatId);
    if (!targetedChat) return;
    for (const user of targetedChat.users) {
      if (user.ranksMap)
        user.ranksMap = user.ranksMap.filter((rank) => rank !== data.id);
      if (user.ranks)
        user.ranks = user.ranks.filter((rank) => rank.id !== data.id);
    }
    if (targetedChat.association.ranksMap)
      targetedChat.association.ranksMap =
        targetedChat.association.ranksMap.filter((rank) => rank !== data.id);
    if (targetedChat.association.ranks)
      targetedChat.association.ranks = targetedChat.association.ranks.filter(
        (rank) => rank.id !== data.id
      );
    targetedChat.ranks = targetedChat.ranks.filter(
      (rank) => rank.id !== data.id
    );
  });
  sockets.trackedUsers.on(
    "changeUsername",
    (data: { id: number; username: string }) => {
      const u = user.tracked.find((user) => user.id === data.id);
      if (!u) return;
      u.username = data.username;
    }
  );
  sockets.trackedUsers.on(
    "changeAvatar",
    (data: { id: number; avatar: string }) => {
      const u = user.tracked.find((user) => user.id === data.id);
      if (!u) return;
      u.avatar = data.avatar;
    }
  );
}
