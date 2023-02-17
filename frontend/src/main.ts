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
    $functions: {
      fileSize: (size: number) => string;
      copy: (text: string) => void;
      doSinglePulse: (id: string, other: any, timeOnPage?: number) => void;
      avatar: (chat: any) => string | undefined;
    };
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: any;
    $validation: any;
    $workspaces: ReturnType<typeof useWorkspacesStore>;
    $chat: ReturnType<typeof useChatStore>;
    $socket: any;
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
      app.config.globalProperties.$user = user;
      app.config.globalProperties.$app = core;
      app.config.globalProperties.$experiments = experiments;
      app.config.globalProperties.$date = dayjs;
      app.config.globalProperties.$collections = collections;
      app.config.globalProperties.$validation = validation;
      app.config.globalProperties.$workspaces = workspace;
      app.config.globalProperties.$chat = chat;
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

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
app.use(VueApexCharts);
registerPlugins(app);

app.config.performance = true;

app.mount("#app");
