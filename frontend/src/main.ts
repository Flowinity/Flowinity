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
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections";
import validation from "@/plugins/validation";
import "./styles/tpu-editorjs.css";
import VueApexCharts from "vue3-apexcharts";
import SocketIO from "socket.io-client";
import { useChatStore } from "@/store/chat";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $user: ReturnType<typeof useUserStore>;
    $app: ReturnType<typeof useAppStore>;
    $experiments: ReturnType<typeof useExperimentsStore>;
    $date: typeof dayjs;
    $functions: typeof functions;
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: any;
    $validation: any;
    $workspaces: ReturnType<typeof useWorkspacesStore>;
    $chat: ReturnType<typeof useChatStore>;
    $socket: any;
    $friends: ReturnType<typeof useFriendsStore>;
  }
}

const app = createApp({
  ...App,
  ...{
    setup() {
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
      socket.on("message", (newMessage: any) => {
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
        // only push to loaded chats
        if (!chat.chats[newIndex].messages) return;
        if (
          chat.chats[newIndex].messages.find(
            (m) => m.id === newMessage.message.id
          )
        )
          return;
        chat.chats[newIndex].messages.push(newMessage.message as MessageType);
      });
      socket.on("status", (data: User) => {
        const index = friends.friends.findIndex((f) => f.friendId === data.id);
        if (index === -1) return;
        friends.friends[index].otherUser.status = data.status;
      });
      socket.on("friendRequestAccepted", (data: Friend) => {
        friends.friends.push(data);
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
          const index = chat.chats.findIndex((c) => c.id === data.chatId);
          console.log(index);
          if (index === -1) return;
          if (!chat.chats[index].messages) return;
          const messageIndex = chat.chats[index].messages.findIndex(
            (m) => m.id === data.id
          );
          if (messageIndex === -1) return;
          console.log(data);
          chat.chats[index].messages[messageIndex].content = data.content;
          chat.chats[index].messages[messageIndex].edited = data.edited;
          chat.chats[index].messages[messageIndex].editedAt = data.editedAt;
        }
      );
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
import { useToast } from "vue-toastification";
import { useWorkspacesStore } from "@/store/workspaces";
import { useFriendsStore } from "@/store/friends";
import { Chat } from "@/models/chat";
import { Message as MessageType } from "@/models/message";
import { User } from "@/models/user";
import { Friend } from "@/models/friend";

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
app.use(VueApexCharts);
registerPlugins(app);

app.config.performance = true;

app.mount("#app");
