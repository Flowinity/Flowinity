/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import VueAxios from "vue-axios";
import axios from "@/plugins/axios";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { useExperimentsStore } from "@/store/experiments";
import "./styles/main.scss";
import dayjs from "@/plugins/dayjs";
import Toast, { PluginOptions, useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections";
import validation from "@/plugins/validation";
import "./styles/tpu-editorjs.css";
import VueApexCharts from "vue3-apexcharts";
import SocketIO from "socket.io-client";
import { useChatStore } from "@/store/chat";
import { Router } from "vue-router";
import { useWorkspacesStore } from "@/store/workspaces";
import { useFriendsStore } from "@/store/friends";
import { Chat } from "@/models/chat";
import { Message, Message as MessageType } from "@/models/message";
import { User } from "@/models/user";
import { Friend } from "@/models/friend";
import { Collection } from "@/models/collection";
import "floating-vue/dist/style.css";
import vuetify from "./plugins/vuetify";
import { ChatAssociation } from "@/models/chatAssociation";
import router from "@/router";
import MessageToast from "@/components/Communications/MessageToast.vue";
import { useMailStore } from "@/store/mail";
import { useTheme } from "@troplo/vuetify";
//@ts-ignore
import VueMatomo from "vue-matomo";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $user: ReturnType<typeof useUserStore>;
    $app: ReturnType<typeof useAppStore>;
    $experiments: ReturnType<typeof useExperimentsStore>;
    $date: typeof dayjs;
    $functions: typeof functions;
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: any;
    $validation: typeof validation;
    $workspaces: ReturnType<typeof useWorkspacesStore>;
    $chat: ReturnType<typeof useChatStore>;
    $socket: any;
    $friends: ReturnType<typeof useFriendsStore>;
    $mail: ReturnType<typeof useMailStore>;
  }
}

declare global {
  interface Window {
    tpuInternals: {
      processLink: (link: string) => void;
      readChat: () => void;
      lookupUser: (id: number) => User;
      lookupChat: (id: number) => Chat;
      openUser: (id: number) => void;
      setChat: (id: number) => void;
      lookupCollection: (id: number) => Collection;
      openCollection: (id: number) => void;
      router: Router;
    };
    _paq: {
      push: (args: any[]) => void;
    };
    _cordovaNative: any;
  }
}

const app = createApp({
  ...App,
  ...{
    setup() {
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
      const user = useUserStore();
      const core = useAppStore();
      const experiments = useExperimentsStore();
      const collections = useCollectionsStore();
      const workspace = useWorkspacesStore();
      const chat = useChatStore();
      const friends = useFriendsStore();
      const mail = useMailStore();
      const toast = useToast();
      app.config.globalProperties.$user = user;
      app.config.globalProperties.$app = core;
      app.config.globalProperties.$experiments = experiments;
      if (window.location.pathname.startsWith("/slideshow/")) return;
      app.config.globalProperties.$date = dayjs;
      app.config.globalProperties.$collections = collections;
      app.config.globalProperties.$validation = validation;
      app.config.globalProperties.$workspaces = workspace;
      app.config.globalProperties.$chat = chat;
      app.config.globalProperties.$friends = friends;
      app.config.globalProperties.$mail = mail;
      app.config.globalProperties.$socket = SocketIO(
        import.meta.env.DEV
          ? ""
          : import.meta.env.CORDOVA
          ? "https://images.flowinity.com"
          : "",
        {
          transports: ["websocket", "polling"],
          auth: {
            token: localStorage.getItem("token")
          }
        }
      );
      window.socket = app.config.globalProperties.$socket;
      app.config.globalProperties.$functions = functions;
      user.init().then(() => {
        console.info("[TPU/UserStore] User initialized");
        if (user.user?.plan?.internalName === "GOLD") {
          vuetify.theme.themes.value.dark.colors.primary = "#FFD700";
          vuetify.theme.themes.value.light.colors.primary = "#FFD700";
          vuetify.theme.themes.value.dark.colors.info = "#FFD700";
          vuetify.theme.themes.value.light.colors.info = "#FFD700";
          document.body.classList.add("gold");
        }
      });
      core.init().then(() => {
        console.info("[TPU/CoreStore] Core initialized");
      });
      experiments.init().then(() => {
        console.info("[TPU/ExperimentsStore] Experiments initialized");
      });

      // Socket handlers
      const socket = app.config.globalProperties.$socket;
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
        if (
          newMessage.chat.id === chat.selectedChat?.id &&
          chat.isCommunications
        )
          return;
        const index = chat.chats.findIndex((c) => c.id === newMessage.chat.id);
        if (index === -1) return;
        // move chat to top
        const chatToMove = chat.chats[index];
        chat.chats.splice(index, 1);
        chat.chats.unshift(chatToMove);
        const newIndex = chat.chats.findIndex(
          (c) => c.id === newMessage.chat.id
        );
        if (
          experiments.experiments.COMMUNICATIONS_KEEP_LOADED &&
          !chat.chats[newIndex].messages &&
          !chat.chats[newIndex].messages.find(
            (m) => m.id === newMessage.message.id
          )
        ) {
          chat.chats[newIndex].messages.unshift(
            newMessage.message as MessageType
          );
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
        if (index === -1) return;
        friends.friends[index].otherUser.status = data.status;
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
        console.log(index);
        if (index === -1) return;
        const userIndex = chat.chats[index].users.findIndex(
          (u) => u.id === data.id
        );
        console.log(userIndex);
        if (userIndex === -1) return;
        chat.chats[index].users[userIndex] = {
          ...chat.chats[index].users[userIndex],
          ...data
        };
      });
      socket.on("addChatUsers", (data: any) => {
        const index = chat.chats.findIndex((c) => c.id === data.chatId);
        console.log(index);
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
        console.log(data);

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

      // For TPU quick uploads
      document.addEventListener("paste", (e) => {
        if (
          [
            "Communications",
            "Communication",
            "Note",
            "Workspace Item"
          ].includes(router.currentRoute.value.name as string)
        )
          return;
        if (!e.clipboardData) return;
        console.log("[TPU/InstantUpload] Paste detected");
        if (core.dialogs.upload.loading) return;
        if (e.clipboardData.files.length > 0) {
          // Convert the legacy FileList object to an Array
          core.dialogs.upload.files = [...e.clipboardData.files];
          core.upload();
        }
      });
    },
    watch: {
      "$route.params.chatId"(val) {
        if (!val) return;
        this.$chat.setChat(parseInt(val));
      },
      "$route.params.mailbox"(val) {
        if (!val) return;
        this.$mail.setMailbox(val);
      },
      "$app.workspaceDrawer"(val) {
        if (this.$app.forcedWorkspaceDrawer) return;
        localStorage.setItem("workspaceDrawer", val.toString());
      },
      "$app.title"(val) {
        document.title = val + " - TPU";
      }
    }
  }
});

const options: PluginOptions = {
  shareAppContext: true
};

app.use(VueMatomo, {
  host: "https://analytics.flowinity.com",
  siteId: 3,
  trackerFileName: "matomo",
  router: router,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  disableCookies: false,
  requireCookieConsent: false,
  enableHeartBeatTimer: false,
  heartBeatTimerInterval: 15,
  debug: false,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: [],
  trackSiteSearch: false,
  crossOrigin: undefined
});

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
app.use(VueApexCharts);
registerPlugins(app);

app.config.performance = true;

app.mount("#tpu-app");
