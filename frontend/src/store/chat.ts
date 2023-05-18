// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Chat, Typing } from "@/models/chat";
import { useExperimentsStore } from "@/store/experiments";
import vuetify from "@/plugins/vuetify";
import { Router, useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { User } from "@/models/user";
import { useUserStore } from "@/store/user";
import { useCollectionsStore } from "@/store/collections";
import { Collection } from "@/models/collection";
import { Message as MessageType, Message } from "@/models/message";
import { useFriendsStore } from "@/store/friends";
import { Paginate } from "@/types/paginate";
import dayjs from "../plugins/dayjs";
import { useToast } from "vue-toastification";

export interface ChatState {
  search: {
    value: boolean;
    results: {
      messages: Message[];
      pager: Paginate;
    };
    loading: boolean;
    query: string;
  };
  notifications: number;
  chats: Chat[];
  selectedChatId: number | null;
  loading: boolean;
  drafts: { [key: string]: string };
  selectedChat: Chat | null;
  memberSidebarShown: boolean;
  isReady: number | null;
  users: User[];
  dialogs: {
    message: {
      value: boolean;
      message: MessageType | null;
      bindingElement: string | null;
      x: number;
      y: number;
      location: string;
    };
    groupSettings: {
      value: boolean;
      item: Chat | undefined;
    };
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
      location: string;
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
  loadNew: boolean;
  loadingNew: boolean;
}

export const useChatStore = defineStore("chat", {
  state: () =>
    ({
      search: {
        value: false,
        results: {
          messages: [] as Message[],
          pager: {
            totalItems: 0,
            currentPage: 1,
            pageSize: 50,
            totalPages: 1,
            startPage: 1,
            endPage: 1,
            startIndex: 0,
            endIndex: 1,
            pages: [1]
          }
        },
        loading: false,
        query: ""
      },
      loadNew: false,
      loadingNew: false,
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
        "app.i.troplo.com",
        "tenor.com",
        "media.tenor.com",
        "www.tenor.com",
        "giphy.com",
        "media.giphy.com",
        "www.giphy.com",
        "geo.troplo.com",
        "privateuploader.com",
        "www.privateuploader.com",
        "i.privateuploader.com",
        "next.privateuploader.com",
        "tpu-mobile.troplo.com"
      ],
      dialogs: {
        message: {
          value: false,
          message: null as MessageType | null,
          bindingElement: null as string | null,
          x: 0,
          y: 0,
          location: "top"
        },
        groupSettings: {
          value: false,
          item: undefined
        },
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
          y: 0,
          location: "top"
        },
        statusMenu: {
          value: false,
          x: 0,
          y: 0
        }
      }
    } as ChatState),
  actions: {
    async pinMessage(id: number | undefined, pinned: boolean | undefined) {
      if (!id || pinned === undefined) return;
      await axios.put(`/chats/${this.selectedChatId}/message`, {
        pinned,
        id
      });
      useToast().success(
        "Message " + (pinned ? "pinned" : "unpinned") + " successfully."
      );
    },
    async doJump(message: number) {
      const element = document.getElementById(
        "message-" +
          this.selectedChat?.messages?.findIndex((m) => m.id === message)
      );
      if (!element) return false;
      element.scrollIntoView({
        block: "center",
        inline: "center"
      });
      element.classList.add("message-jumped");
      setTimeout(() => {
        element.classList.remove("message-jumped");
      }, 1000);
      return true;
    },
    async jumpToMessage(message: number) {
      if (!(await this.doJump(message))) {
        this.loadingNew = true;
        await this.loadHistory(message + 30, true);
        this.loadingNew = false;
        await this.doJump(message);
      }
    },
    merge(message: MessageType, index: number) {
      if (message.replyId) return false;
      if (message.type !== "message" && message.type) return false;
      const prev = this.selectedChat?.messages[index + 1];
      if (!prev) return false;
      if (prev.type !== "message" && prev.type) return false;
      if (dayjs(message.createdAt).diff(prev.createdAt, "minutes") > 5)
        return false;
      return prev.user?.id === message.user?.id;
    },
    async doSearch() {
      this.search.loading = true;
      const { data } = await axios.get(`/chats/${this.selectedChatId}/search`, {
        params: {
          query: this.search.query,
          page: this.search.results.pager.currentPage
        }
      });
      this.search.results = data;
      this.search.loading = false;
    },
    getChatName(chat: Chat) {
      if (!chat) return "Communications";
      if (chat.type === "direct") {
        return chat.recipient?.username || "Deleted User";
      } else {
        return chat.name;
      }
    },
    getDraft(chatId: string) {
      return this.drafts[chatId];
    },
    setDraft(chatId: string, draft: string) {
      if (draft?.trim()?.length) {
        this.drafts[chatId] = draft;
      } else {
        delete this.drafts[chatId];
      }
      localStorage.setItem("draftStore", JSON.stringify(this.drafts));
    },
    async saveSettings() {
      const { data } = await axios.patch(
        `/chats/${this.dialogs.groupSettings.item?.association?.id}`,
        {
          name: this.dialogs.groupSettings.item?.name
        }
      );
      return data;
    },
    async sound() {
      let sound = await import("@/assets/audio/notification.wav");
      const audio = new Audio(sound.default);
      await audio.play();
    },
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
    lookupChat(id: number) {
      return (
        (this.chats.find((chat) => chat.id === id) as Chat) ||
        ({
          name: "Unknown Chat"
        } as Chat)
      );
    },
    openUser(id: number) {
      this.dialogs.user.username = this.lookupUser(id).username;
      this.dialogs.user.value = true;
    },
    lookupUser(id: number) {
      const friends = useFriendsStore();
      for (const chat of this.chats) {
        const user = friends.friends.find((user) => user?.otherUser?.id === id);
        if (user) {
          return user.otherUser as User;
        } else {
          const user = chat.users.find((user) => user?.tpuUser?.id === id);
          if (user) {
            return user.tpuUser as User;
          }
        }
      }
      return {
        username: "Unknown User"
      } as User;
    },
    async createChat(users: number[]) {
      const { data } = await axios.post("/chats", { users });
      return data;
    },
    async readChat(chatId?: number) {
      await window.socket.emit("readChat", chatId || this.selectedChatId);
      if (this.selectedChat) this.selectedChat.unread = 0;
    },
    async typing() {
      await window.socket.emit("typing", this.selectedChatId);
    },
    async setChat(id: number) {
      this.loading = true;
      const experimentsStore = useExperimentsStore();
      if (!experimentsStore.experiments.COMMUNICATIONS_KEEP_LOADED) {
        if (this.selectedChat?.messages) this.selectedChat.messages = [];
      }
      this.selectedChatId = id;
      const appStore = useAppStore();
      const chat = this.chats.find(
        (chat: Chat) => chat.association.id === id
      ) as Chat;
      appStore.title = this.chatName;
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
      if (chat?.messages?.length) {
        this.readChat();
        return;
      }
      this.loading = false;
      this.isReady = id;
      appStore.title = this.chatName;

      this.readChat();
    },
    async loadHistory(
      offset?: number,
      forceUnload: boolean = false,
      up: boolean = true
    ) {
      this.loadingNew = true;
      const { data } = await axios.get(
        `/chats/${this.selectedChatId}/messages?offset=${
          offset || this.currentOffset[up ? "up" : "down"]
        }&position=${up ? "top" : "bottom"}`
      );
      const index = this.chats.findIndex(
        (chat: Chat) => chat.association.id === this.selectedChatId
      );
      if (!data.length) {
        this.loadNew = false;
      }
      if (!up && !forceUnload && !offset) {
        this.chats[index].messages.unshift(...data);
        if (this.chats[index].messages.length > 150) {
          this.chats[index].messages = this.chats[index].messages.slice(
            0,
            this.chats[index].messages.length - 100
          );
        }
      } else if (up && !forceUnload && !offset) {
        this.chats[index].messages.push(...data);
        // if messages.length over 150, remove the first 50
        if (this.chats[index].messages.length > 150) {
          this.chats[index].messages = this.chats[index].messages.slice(100);
          this.loadNew = true;
        }
      } else {
        this.chats[index].messages = data;
        this.loadNew = true;
      }
      this.loadingNew = false;
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
      const app = useAppStore();
      localStorage.setItem("chatStore", JSON.stringify(this.chats));
    },
    async init() {
      try {
        const trustedDomains = localStorage.getItem("trustedDomainsStore");
        if (trustedDomains) {
          this.trustedDomains = JSON.parse(trustedDomains);
        }
      } catch {}
      try {
        const drafts = localStorage.getItem("draftStore");
        if (drafts) {
          this.drafts = JSON.parse(drafts);
        }
      } catch {}
      if (!window.tpuInternals) {
        const collection = useCollectionsStore();
        const router = useRouter() as Router;
        window.tpuInternals = {
          processLink: this.processLink,
          readChat: this.readChat,
          lookupUser: this.lookupUser,
          setChat: ((id) => router.push("/communications/" + id)) as (
            id: number
          ) => void,
          lookupChat: this.lookupChat,
          openUser: this.openUser,
          router,
          lookupCollection: (id) => {
            return (
              (collection.items.find(
                (collection) => collection.id === id
              ) as Collection) ||
              ({
                name: "Unknown Collection"
              } as Collection)
            );
          },
          openCollection: ((id) => router.push("/collections/" + id)) as (
            id: number
          ) => void
        };
      }
      window.tpuInternals.processLink = this.processLink;
      this.getChats();
    }
  },
  getters: {
    currentOffset(state: ChatState) {
      const down = state.selectedChat?.messages[0]?.id
        ? state.selectedChat?.messages[0]?.id
        : 0;
      const up = state.selectedChat?.messages[
        state.selectedChat?.messages.length - 1
      ]?.id
        ? state.selectedChat?.messages[state.selectedChat?.messages.length - 1]
            ?.id
        : 0;
      return {
        up,
        down
      };
    },
    hasPermissions(state: ChatState) {
      return {
        owner: state.selectedChat?.association?.rank === "owner",
        admin:
          state.selectedChat?.association?.rank === "admin" ||
          state.selectedChat?.association?.rank === "owner",
        member: true
      };
    },
    typers(state: ChatState) {
      const user = useUserStore();
      if (!state.selectedChat) return "";
      if (!state.selectedChat.typers?.length) return "";
      if (state.selectedChat?.typers?.length > 3) {
        return `${state.selectedChat.typers.length} people are typing...`;
      }

      // filter out the current user and return the usernames
      const typers = state.selectedChat.typers
        .filter((typer: Typing) => typer.user.id !== user.user?.id)
        .map((typer: Typing) => {
          return typer.user.username;
        });

      const last = typers.pop();
      if (typers.length) {
        return `${typers.join(", ")} and ${last} are typing...`;
      } else {
        return `${last} is typing...`;
      }
    },
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
        return (
          useFriendsStore().getName(state.selectedChat?.recipient) ||
          "Deleted User"
        );
      } else {
        return state.selectedChat.name;
      }
    },
    communicationsSidebar() {
      return !vuetify.display.mobile.value && !useAppStore().rail;
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
