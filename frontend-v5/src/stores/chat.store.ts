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
import type { Chat, User } from "@/gql/graphql";

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([]);
  const selectedChatAssociationId = ref(0);
  const selectedChat = computed(() => {
    return chats.value.find(
      (chat) => chat.association?.id === selectedChatAssociationId.value
    );
  });

  return {
    chats,
    selectedChatAssociationId,
    selectedChat
  };
});
