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
      app.config.globalProperties.$socket = SocketIO(
        import.meta.env.DEV ? "http://localhost:34582" : "",
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
        if (newMessage.chat.id === chat.selectedChat?.id) return;
        const index = chat.chats.findIndex((c) => c.id === newMessage.chat.id);
        if (index === -1) return;
        // move chat to top
        const chatToMove = chat.chats[index];
        chat.chats.splice(index, 1);
        chat.chats.unshift(chatToMove);
        const newIndex = chat.chats.findIndex(
          (c) => c.id === newMessage.chat.id
        );
        if (newMessage.message.userId !== user.user?.id)
          chat.chats[newIndex].unread++;
        chat.sound();
        if (!chat.chats[newIndex].messages) return;
        if (
          chat.chats[newIndex].messages.find(
            (m) => m.id === newMessage.message.id
          )
        )
          return;
        chat.chats[newIndex].messages.unshift(
          newMessage.message as MessageType
        );
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
        }) => {
          const message = checkMessage(data.id, data.chatId);
          if (!message) return;
          chat.chats[message.index].messages[message.messageIndex].content =
            data.content;
          chat.chats[message.index].messages[message.messageIndex].edited =
            data.edited;
          chat.chats[message.index].messages[message.messageIndex].editedAt =
            data.editedAt;
        }
      );
      socket.on(
        "embedResolution",
        (data: { chatId: number; id: number; embeds: any[] }) => {
          if (data.chatId === chat.selectedChat?.id) return;
          const message = checkMessage(data.id, data.chatId);
          if (!message) return;
          chat.chats[message.index].messages[message.messageIndex].embeds =
            data.embeds;
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
      "$app.workspaceDrawer"(val) {
        if (this.$app.forcedWorkspaceDrawer) return;
        localStorage.setItem("workspaceDrawer", val.toString());
      },
      "$app.title"(val) {
        document.title = val + " - TPUvNEXT";
      }
    }
  }
});

const options: PluginOptions = {};

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
app.use(VueApexCharts);
registerPlugins(app);

app.config.performance = true;

app.mount("#app");
