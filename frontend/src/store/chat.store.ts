// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useExperimentsStore } from "@/store/experiments.store";
import vuetify from "@/plugins/vuetify";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useFriendsStore } from "@/store/friends.store";
import dayjs from "../plugins/dayjs";
import { useToast } from "vue-toastification";
import { ChatsQuery } from "@/graphql/chats/chats.graphql";
import { SendMessageMutation } from "@/graphql/chats/sendMessage.graphql";
import {
  Chat,
  ChatEmoji,
  ChatInvite,
  ChatRank,
  InfiniteMessagesInput,
  Message,
  MessageType,
  PagedMessagesInput,
  PartialUserFriend,
  ScrollPosition,
  ToggleUser,
  UpdateChatInput,
  UserStatus
} from "@/gql/graphql";
import {
  MessagesQuery,
  PagedMessagesQuery
} from "@/graphql/chats/messages.graphql";
import { StateHandler } from "v3-infinite-loading/lib/types";
import { CreateChatMutation } from "@/graphql/chats/createChat.graphql";
import { UpdateChatMutation } from "@/graphql/chats/updateChat.graphql";
import { AddChatUserMutation } from "@/graphql/chats/addUser.graphql";
import { LeaveGroupMutation } from "@/graphql/chats/deleteGroup.graphql";
import {
  ChatInviteQuery,
  JoinChatInviteMutation
} from "@/graphql/chats/invite.graphql";
import { ToggleUserRankMutation } from "@/graphql/chats/toggleUserRank.graphql";
import { Typing } from "@/models/chat";
import { nextTick } from "vue";

export const useChatStore = defineStore("chat", {
  state: () => ({
    search: {
      value: false,
      results: {
        items: [] as Message[],
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
    limit: 0,
    chats: [] as Chat[],
    loading: false,
    drafts: {},
    selectedChatId: parseInt(localStorage.getItem("selectedChatId") || "0"),
    memberSidebarShown: true,
    isReady: null,
    trustedDomains: [] as string[],
    dialogs: {
      leave: {
        value: false,
        itemId: undefined as number | undefined,
        loading: false
      },
      message: {
        value: false,
        message: null as Message | null,
        bindingElement: null as string | null,
        x: 0,
        y: 0,
        location: "top"
      },
      groupSettings: {
        value: false,
        itemId: undefined as number | undefined,
        loading: false
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
        user: null as PartialUserFriend | null,
        bindingElement: null as string | null,
        x: 0,
        y: 0,
        location: "top"
      },
      emojiMenu: {
        value: false,
        bindingElement: null as string | null,
        location: "right",
        emoji: null as ChatEmoji | null,
        chat: null as Chat | null
      },
      statusMenu: {
        value: false,
        x: 0,
        y: 0
      }
    },
    emoji: [] as ChatEmoji[],
    recentEmoji: {} as Record<string, number>
  }),
  actions: {
    openEmoji(
      emojiId: string,
      emojiName: string,
      emojiUrl: string,
      chatId: number,
      messageId: number,
      bindingElement: string
    ) {
      console.log(5940);
      this.dialogs.emojiMenu.bindingElement = `#${bindingElement}`;
      this.dialogs.emojiMenu.chat = this.chats.find(
        (chat) => chat.id === chatId
      );
      this.dialogs.emojiMenu.emoji = {
        name: emojiName,
        id: emojiId,
        icon: emojiUrl
      };
      this.dialogs.emojiMenu.value = true;
    },
    async toggleUserRank(
      updatingChatAssociationId: number,
      chatAssociationId: number,
      rankId: string
    ) {
      await this.$apollo.mutate({
        mutation: ToggleUserRankMutation,
        variables: {
          input: {
            chatAssociationId,
            updatingChatAssociationId,
            rankId
          }
        }
      });
    },
    async joinInvite(inviteId: string): Promise<{ id: number }> {
      const {
        data: { joinChatFromInvite }
      } = await this.$apollo.mutate({
        mutation: JoinChatInviteMutation,
        variables: {
          input: {
            inviteId
          }
        }
      });
      return joinChatFromInvite;
    },
    async getInvite(inviteId: string): Promise<ChatInvite> {
      const {
        data: { chatInvite }
      } = await this.$apollo.query({
        query: ChatInviteQuery,
        variables: {
          input: {
            inviteId
          }
        }
      });
      return chatInvite;
    },
    async leaveChat(associationId: number) {
      await this.$apollo.mutate({
        mutation: LeaveGroupMutation,
        variables: {
          input: {
            associationId
          }
        }
      });
    },
    getRankColor(ranksMap: string[], ranks: ChatRank[]) {
      if (!ranksMap) ranksMap = [];
      for (const rankId of ranksMap) {
        const rank = ranks.find((r) => r.id === rankId);
        if (rank) {
          if (rank.color !== null) {
            return rank.color;
          }
        }
      }
      return null;
    },
    canEditRank(rankIndex: number, chat?: Chat) {
      const userStore = useUserStore();
      if (chat.userId === userStore.user?.id) return true;
      const userRank = chat.ranks.find(
        (rank) =>
          rank.id ===
          chat.users.find((user) => user.userId === chat.association.userId)
            .ranksMap[0]
      );
      if (userRank.index > rankIndex) return true;
      if (userRank.index === rankIndex && this.hasPermission("TRUSTED", chat))
        return true;
      return false;
    },
    hasPermission(permission: string | string[], chat?: Chat) {
      const permissionsArray = Array.isArray(permission)
        ? permission
        : [permission];

      const c: Chat | undefined = chat ?? this.selectedChat;

      return (
        c?.association?.permissions?.some(
          (perm) =>
            permissionsArray.includes(perm) ||
            (!permissionsArray.includes("TRUSTED") && perm === "ADMIN")
        ) ||
        (c?.association?.userId === c?.userId && c?.type === "group")
      );
    },
    async sendMessage(
      content: string,
      attachments = [],
      replyId?: number,
      associationId?: number
    ) {
      await this.$apollo.mutate({
        mutation: SendMessageMutation,
        variables: {
          input: {
            content,
            attachments: attachments.filter((attachment) => attachment),
            replyId,
            associationId: associationId || this.selectedChat?.association?.id
          }
        }
      });
    },
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
      const element = document.getElementById(`message-id-${message}`);
      if (!element) return false;
      element.scrollIntoView({
        block: "center",
        inline: "center"
      });
      element.classList.add("message-jumped");
      setTimeout(() => {
        element.classList.remove("message-jumped");
      }, 1000);
      await nextTick();
      element.scrollIntoView({
        block: "center",
        inline: "center"
      });
      return true;
    },
    async jumpToMessage(message: number) {
      if (!(await this.doJump(message))) {
        this.selectedChat.messages = null;
        this.loadingNew = true;
        await this.loadHistory(
          undefined,
          ScrollPosition.Top,
          message ? message + 30 : undefined
        );
        this.loadingNew = false;
        await this.doJump(message);
      }
    },
    merge(message: Message, index: number) {
      if (message.replyId) return false;
      if (message.type !== MessageType.Message && message.type) return false;
      const prev = this.selectedChat?.messages[index + 1];
      if (!prev) return false;
      if (prev.type !== MessageType.Message && prev.type) return false;
      if (dayjs(message.createdAt).diff(prev.createdAt, "minutes") > 5)
        return false;
      return prev.userId === message.userId;
    },
    async doSearch(sort: number) {
      this.search.loading = true;
      this.search.results = await this.getMessages({
        search: {
          query: this.search.query
        },
        page: this.search.results.pager.currentPage || 1,
        associationId: this.selectedChatId,
        position: !sort ? ScrollPosition.Top : ScrollPosition.Bottom
      });
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
    async saveSettings(input?: Partial<UpdateChatInput>) {
      this.dialogs.groupSettings.loading = true;
      const {
        data: { updateChat }
      } = await this.$apollo.mutate({
        mutation: UpdateChatMutation,
        variables: {
          input: {
            name: input?.name ?? this.editingChat.name,
            associationId:
              input?.associationId ?? this.editingChat.association.id,
            background: input?.background === null ? null : undefined,
            icon: input?.icon === null ? null : undefined,
            description: input?.description ?? this.editingChat.description
          }
        }
      });
      this.dialogs.groupSettings.loading = false;
      return updateChat;
    },
    async sound() {
      const experiments = useExperimentsStore();
      let sound;
      const id = experiments.experiments.NOTIFICATION_SOUND;
      if (id === 3) {
        sound = await import("@/assets/audio/kfx.wav");
      } else if (id === 2) {
        sound = await import("@/assets/audio/notification.wav");
      } else {
        sound = await import("@/assets/audio/proposal1.wav");
      }
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
      const core = useAppStore();
      if (
        this.trustedDomains.includes(domain) ||
        core.site.preTrustedDomains.includes(domain)
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
      const user = this.lookupUser(id);
      if (!user.id) return;
      this.dialogs.user.username = user.username;
      this.dialogs.user.value = true;
    },
    lookupUser(id: number): PartialUserFriend {
      const user = useUserStore();
      return (
        user.users[id] || {
          username: "Unknown User",
          status: UserStatus.Offline,
          administrator: false,
          createdAt: new Date().toISOString(),
          id: 0,
          moderator: false,
          bot: false
        }
      );
    },
    async changeUsers(
      users: number[],
      add: boolean = true,
      chatAssociationId: number
    ) {
      await this.$apollo.mutate({
        mutation: AddChatUserMutation,
        variables: {
          input: {
            chatAssociationId,
            users,
            action: add ? ToggleUser.Add : ToggleUser.Remove
          }
        }
      });
    },
    async createChat(users: number[]) {
      const {
        data: { createChat }
      } = await this.$apollo.mutate({
        mutation: CreateChatMutation,
        variables: {
          input: {
            users
          }
        }
      });
      return createChat;
    },
    async readChat(chatId?: number) {
      if (document.hasFocus()) {
        await this.$app.$sockets.chat.emit(
          "readChat",
          chatId || this.selectedChatId
        );
        if (this.selectedChat) this.selectedChat.unread = 0;
      }
    },
    async typing() {
      await this.$app.$sockets.chat.emit("typing", this.selectedChatId);
    },
    async getMessages(
      input: InfiniteMessagesInput | PagedMessagesInput
    ): Promise<Message[]> {
      const { data } = await this.$apollo.query({
        query: "page" in input ? PagedMessagesQuery : MessagesQuery,
        variables: {
          input
        },
        fetchPolicy: "network-only"
      });

      return "page" in input
        ? structuredClone(data.messagesPaged)
        : structuredClone(data.messages);
    },
    async setChat(id: number) {
      this.loading = true;
      const experimentsStore = useExperimentsStore();
      if (!experimentsStore.experiments.COMMUNICATIONS_KEEP_LOADED) {
        if (this.selectedChat?.messages) this.selectedChat.messages = [];
      }
      this.selectedChatId = id;
      localStorage.setItem("selectedChatId", id.toString());
      const appStore = useAppStore();
      const chat = this.chats.find(
        (chat: Chat) => chat.association.id === id
      ) as Chat;
      appStore.title = this.chatName(this.selectedChat);
      const data = await this.getMessages({
        associationId: id,
        position: ScrollPosition.Top
      });
      if (id !== this.selectedChatId) return;
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
        this.isReady = id;
        this.loading = false;
        return;
      }
      this.loading = false;
      this.isReady = id;
      appStore.title = this.chatName(this.selectedChat);
      this.readChat();
    },
    async loadHistory(
      $state?: StateHandler,
      position: ScrollPosition = ScrollPosition.Top,
      offset?: number
    ) {
      if (offset) {
        this.selectedChat.messages = null;
        this.loadNew = true;
      }
      this.loadingNew = true;
      if ($state) $state.loading();
      const data = await this.getMessages({
        associationId: this.selectedChatId,
        position,
        offset:
          offset !== undefined
            ? offset
            : position === ScrollPosition.Top
            ? this.currentOffset.up
            : this.currentOffset.down,
        limit: 50
      });

      if (data.length) {
        if (offset) {
          this.selectedChat.messages = data;
        } else {
          if (position === ScrollPosition.Top) {
            this.selectedChat?.messages?.push(...data);
            if (this.selectedChat?.messages?.length > 350) {
              this.loadNew = true;
              this.selectedChat.messages.splice(0, 50);
            }
          } else {
            this.selectedChat?.messages?.unshift(...data);
            if (this.selectedChat?.messages?.length > 350) {
              this.loadNew = true;
              this.selectedChat.messages.splice(-50);
            }
          }
        }
        if ($state) $state.loaded();
        if (data.length < 50 || offset === 0) {
          if ($state) $state.complete();
        }
        this.loadingNew = false;
        if (offset) {
          this.loadNew = true;
        }
      } else {
        if ($state) $state.complete();
        this.loadingNew = false;
        if (ScrollPosition.Bottom) {
          this.loadNew = false;
        }
      }
      this.loadingNew = false;
    },
    async getChats() {
      try {
        const chats = localStorage.getItem("chatStore");
        if (chats) {
          this.chats = JSON.parse(chats);
        }
      } catch {
        //
      }
      const {
        data: { chats }
      } = await this.$apollo.query({
        query: ChatsQuery
      });
      this.chats = chats
        .map((chat: Chat, index: number) => ({
          ...chat,
          messages: this.chats[index]?.messages || null
        }))
        .sort((a: Chat, b: Chat) => {
          return (
            Number(b._redisSortDate) - Number(a._redisSortDate) ||
            Number(b.id) - Number(a.id)
          );
        });
      localStorage.setItem(
        "chatStore",
        JSON.stringify(
          this.chats.map((chat) => {
            chat.messages = undefined;
            return chat;
          })
        )
      );
    },
    async init() {
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
    },
    chatName(chat: Chat) {
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
  },
  getters: {
    editingChat() {
      return this.chats.find((chat) => {
        return chat.id === this.dialogs.groupSettings.itemId;
      });
    },
    renderableReadReceipts() {
      return 3;
    },
    currentOffset() {
      if (!this.selectedChat?.messages?.length) return { up: 0, down: 0 };
      const down = this.selectedChat?.messages[0]?.id
        ? this.selectedChat?.messages[0]?.id
        : 0;
      const up = this.selectedChat?.messages[
        this.selectedChat?.messages.length - 1
      ]?.id
        ? this.selectedChat?.messages[this.selectedChat?.messages.length - 1]
            ?.id
        : 0;
      return {
        up,
        down
      };
    },
    hasPermissions() {
      return {
        owner: this.selectedChat?.association?.rank === "owner",
        admin:
          this.selectedChat?.association?.rank === "admin" ||
          this.selectedChat?.association?.rank === "owner",
        member: true
      };
    },
    typers() {
      const user = useUserStore();
      if (!this.selectedChat) return "";
      if (!this.selectedChat.typers?.length) return "";
      if (this.selectedChat?.typers?.length > 3) {
        return `${this.selectedChat.typers.length} people are typing...`;
      }

      // filter out the current user and return the usernames
      const typers = this.selectedChat.typers
        .filter((typer: Typing) => typer.userId !== user.user?.id)
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
    totalUnread(state) {
      return state.chats.reduce((total: number, chat: Chat) => {
        return total + chat.unread;
      }, 0);
    },
    selectedChat(state) {
      return state.chats.find(
        (chat: Chat) => chat.association.id === state.selectedChatId
      ) as Chat | null;
    },
    communicationsSidebar() {
      return !vuetify.display.mobile.value && !useAppStore().rail;
    },
    memberSidebar(state) {
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
