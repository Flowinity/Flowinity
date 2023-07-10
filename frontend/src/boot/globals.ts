import router from "@/router";
import { useToast } from "vue-toastification";
import SocketIO from "socket.io-client";

// Import Plugins
import functions from "@/plugins/functions";
import axios from "@/plugins/axios";
import vuetify from "@/plugins/vuetify";
import dayjs from "@/plugins/dayjs";
import validation from "@/plugins/validation";

// Import Stores
import { useAdminStore } from "@/store/admin";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { useExperimentsStore } from "@/store/experiments";
import { useCollectionsStore } from "@/store/collections";
import { useWorkspacesStore } from "@/store/workspaces";
import { useChatStore } from "@/store/chat";
import { useFriendsStore } from "@/store/friends";
import { useMailStore } from "@/store/mail";

export default function setup(app: any): void {
  const user = useUserStore();
  const core = useAppStore();
  const experiments = useExperimentsStore();
  const collections = useCollectionsStore();
  const workspace = useWorkspacesStore();
  const chat = useChatStore();
  const friends = useFriendsStore();
  const mail = useMailStore();
  const toast = useToast();

  app.config.globalProperties.axios = axios;
  core.themeProviderDefaults.theme = vuetify.theme.themes.value;
  core.themeProviderDefaults.global = vuetify.defaults.value;
  app.config.globalProperties.$user = user;
  app.config.globalProperties.$app = core;
  app.config.globalProperties.$experiments = experiments;
  app.config.globalProperties.$admin = useAdminStore();

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

  user.init().then((): void => {
    console.info("[TPU/UserStore] User initialized");
  });

  core.init().then((): void => {
    if (!core.site.finishedSetup) router.push("/setup");

    console.info("[TPU/CoreStore] Core initialized");
  });

  experiments.init().then((): void => {
    console.info("[TPU/ExperimentsStore] Experiments initialized");
  });

  window.central = {
    user: user.user,
    emit: (platform: string, event: string, data: any): void => {
      if (platform === "geo" && event === "history") {
        console.log(data);
      }
    }
  };
}
