import { ref, computed, markRaw, type Raw } from "vue";
import { defineStore } from "pinia";
import {
  RiAndroidFill,
  RiAndroidLine,
  RiChat1Line,
  RiDashboardLine,
  RiFileTextFill,
  RiFileTextLine,
  RiGalleryLine,
  RiGiftFill,
  RiGiftLine,
  RiGroupFill,
  RiGroupLine,
  RiHome5Fill,
  RiHome5Line,
  RiInformationFill,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiSettings4Line,
  RiSettings5Fill,
  RiSettings5Line,
  RiUserFill,
  RiUserLine,
  type SVGComponent
} from "vue-remix-icons";
import type { Chat, ChatEmoji, User } from "@/gql/graphql";
import { useFriendsStore } from "@/stores/friends.store";
import { useUserStore } from "@/stores/user.store";

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

  return {
    chats,
    selectedChatAssociationId,
    selectedChat,
    init,
    trustedDomains,
    drafts,
    emoji,
    recentEmoji,
    chatName
  };
});
