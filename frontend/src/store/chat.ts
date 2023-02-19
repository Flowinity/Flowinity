// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Chat } from "@/models/chat";
import { useExperimentsStore } from "@/store/experiments";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import { User } from "@/models/user";

export interface ChatState {
  notifications: number;
  chats: Chat[];
  selectedChatId: number | null;
  loading: boolean;
  drafts: { [key: number]: string };
  selectedChat: Chat | null;
  memberSidebarShown: boolean;
  isReady: number | null;
  users: User[];
  dialogs: {
    user: {
      value: boolean;
      username: string;
    };
    userMenu: {
      value: boolean;
      username: string;
      user: User | null;
      bindingElement: string | null;
      x: number;
      y: number;
    };
    image: {
      value: boolean;
      object: {
        originalURL: string;
        width: number;
        height: number;
        mimeType: string;
        url: string;
      } | null;
    };
    externalSite: {
      value: boolean;
      url: string;
    };
    statusMenu: {
      value: boolean;
      x: number;
      y: number;
    };
  };
  trustedDomains: string[];
  preTrustedDomains: string[];
}

export const useChatStore = defineStore("chat", {
  state: () =>
    ({
      notifications: 0,
      chats: [] as Chat[],
      loading: false,
      drafts: {},
      selectedChatId: null,
      memberSidebarShown: true,
      isReady: null,
      trustedDomains: [] as string[],
      preTrustedDomains: [
        "troplo.com",
        "images.flowinity.com",
        "i.troplo.com",
        "central.troplo.com",
        "home.troplo.com",
        "localhost",
        "youtube.com",
        "youtu.be",
        "vimeo.com",
        "twitch.tv",
        "i.flowinity.com",
        "scpe.eu.org",
        "colubrina.troplo.com",
        "compass.troplo.com",
        "plex.troplo.com",
        "meet.troplo.com",
        "flowinity.com",
        "synclounge.troplo.com",
        "overseerr.troplo.com",
        "jellyfin.troplo.com",
        "radarr.troplo.com",
        "sonarr.troplo.com",
        "google.com",
        "wikipedia.org",
        "troplo.eu.org",
        "flowinity.eu.org",
        "kaverti.com",
        "www.kaverti.com",
        "www.troplo.com",
        "www.flowinity.com",
        "www.google.com",
        "www.wikipedia.org",
        "en.wikipedia.org",
        "discordapp.com",
        "discord.com",
        "www.discordapp.com",
        "www.discord.com",
        "discord.gg",
        "speedtest.net",
        "www.speedtest.net",
        "speedtest.troplo.com",
        "office.com",
        "www.office.com",
        "drive.google.com",
        "www.youtube.com",
        "www.youtu.be",
        "www.vimeo.com",
        "www.twitch.tv",
        "next.images.flowinity.com",
        "legacy.images.flowinity.com",
        "app.i.troplo.com"
      ],
      dialogs: {
        externalSite: {
          value: false,
          url: ""
        },
        image: {
          value: false,
          object: null
        },
        user: {
          value: false,
          username: ""
        },
        userMenu: {
          value: false,
          username: "",
          user: null as User | null,
          bindingElement: null as string | null,
          x: 0,
          y: 0
        },
        statusMenu: {
          value: false,
          x: 0,
          y: 0
        }
      }
    } as ChatState),
  actions: {
    confirmLink(trust: boolean = false) {
      const url = new URL(this.$state.dialogs.externalSite.url);
      const domain = url.hostname;
      if (trust) {
        try {
          const trusted = localStorage.getItem("trustedDomainsStore");
          if (trusted) {
            const trustedDomains = JSON.parse(trusted);
            if (!trustedDomains.includes(domain)) {
              trustedDomains.push(domain);
              this.trustedDomains = trustedDomains;
              localStorage.setItem(
                "trustedDomainsStore",
                JSON.stringify(trustedDomains)
              );
            }
          } else {
            localStorage.setItem(
              "trustedDomainsStore",
              JSON.stringify([domain])
            );
            this.trustedDomains = [domain];
          }
        } catch {
          localStorage.setItem("trustedDomainsStore", JSON.stringify([domain]));
          this.trustedDomains = [domain];
        }
      }
      window.open(this.dialogs.externalSite.url, "_blank");
      this.dialogs.externalSite.value = false;
    },
    processLink(link: string) {
      const url = new URL(link);
      const domain = url.hostname;
      if (
        this.trustedDomains.includes(domain) ||
        this.preTrustedDomains.includes(domain)
      ) {
        window.open(link, "_blank");
      } else {
        this.dialogs.externalSite.value = true;
        this.dialogs.externalSite.url = link;
      }
    },
    async createChat(users: number[]) {
      const { data } = await axios.post("/chats", { users });
      return data;
    },
    async readChat() {
      await axios.put(`/chats/${this.selectedChatId}/read`);
    },
    async setChat(id: number) {
      this.selectedChatId = id;
      const appStore = useAppStore();
      const chat = this.chats.find(
        (chat: Chat) => chat.association.id === id
      ) as Chat;
      if (chat.messages?.length) {
        appStore.title = this.chatName;
        this.loading = false;
        this.isReady = id;
        this.readChat();
        return;
      } else {
        this.loading = true;
      }
      const { data } = await axios.get(`/chats/${id}/messages`);
      const index = this.chats.findIndex(
        (chat: Chat) => chat.association.id === id
      );
      this.chats[index] = {
        ...(this.chats.find(
          (chat: Chat) => chat.association.id === id
        ) as Chat),
        messages: data,
        unread: 0
      };
      this.loading = false;
      this.isReady = id;
      appStore.title = this.chatName;

      this.readChat();
    },
    async getChats() {
      try {
        const chats = localStorage.getItem("chatStore");
        if (chats) {
          this.chats = JSON.parse(chats);
        }
      } catch {}
      const { data } = await axios.get("/chats");
      this.chats = data;
      localStorage.setItem("chatStore", JSON.stringify(this.chats));
    },
    async init() {
      try {
        const trustedDomains = localStorage.getItem("trustedDomainsStore");
        if (trustedDomains) {
          this.trustedDomains = JSON.parse(trustedDomains);
        }
      } catch {}
      if (!window.tpuInternals)
        window.tpuInternals = {
          processLink: this.processLink
        };
      window.tpuInternals.processLink = this.processLink;
      this.getChats();
    }
  },
  getters: {
    totalUnread(state: ChatState) {
      return state.chats.reduce((total: number, chat: Chat) => {
        return total + chat.unread;
      }, 0);
    },
    selectedChat(state: ChatState) {
      return state.chats.find(
        (chat: Chat) => chat.association.id === state.selectedChatId
      ) as Chat | null;
    },
    chatName(state: ChatState) {
      if (!state.selectedChat) return "Communications";
      if (state.selectedChat.type === "direct") {
        return state.selectedChat.recipient?.username || "Deleted User";
      } else {
        return state.selectedChat.name;
      }
    },
    communicationsSidebar() {
      const experimentsStore = useExperimentsStore();
      if (experimentsStore.experiments["COMMUNICATIONS_QUAD_SIDEBAR_LOWRES"])
        return true;
      if (
        experimentsStore.experiments["COMMUNICATIONS_INLINE_SIDEBAR_HIRES"] &&
        vuetify.display.lgAndUp.value
      )
        return false;
      return !vuetify.display.lgAndDown.value;
    },
    memberSidebar(state: ChatState) {
      if (!state.memberSidebarShown) return false;
      const experimentsStore = useExperimentsStore();
      if (experimentsStore.experiments["COMMUNICATIONS_QUAD_SIDEBAR_LOWRES"])
        return true;
      if (
        experimentsStore.experiments["COMMUNICATIONS_INLINE_SIDEBAR_HIRES"] &&
        vuetify.display.lgAndUp.value
      )
        return false;
      return !vuetify.display.lgAndDown.value;
    },
    isCommunications() {
      const router = useRouter();
      return router.currentRoute.value.path.startsWith("/communications/");
    }
  }
});
