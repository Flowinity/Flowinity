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
    recentEmoji
  };
});
