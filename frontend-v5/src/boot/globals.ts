import axios from "@/plugins/axios.ts";
import { useAdminStore } from "@/stores/admin.store";
import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";
import { useExperimentsStore } from "@/stores/experiments.store";
import { useCollectionsStore } from "@/stores/collections.store";
import { useWorkspacesStore } from "@/stores/workspaces.store";
import { useChatStore } from "@/stores/chat.store";
import { useFriendsStore } from "@/stores/friends.store";
import { useMailStore } from "@/stores/mail.store";
import { useToast } from "vue-toastification";
import dayjs from "@/plugins/dayjs";
import validation from "@/plugins/validation";
import functions from "@/plugins/functions";
import { useSocket } from "@/boot/socket.service";
import { useRouter } from "vue-router";

const router = useRouter();

export default function setup(app) {
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
  app.config.globalProperties.$socket = useSocket.core;
  app.config.globalProperties.$sockets = useSocket;
  app.config.globalProperties.$functions = functions;

  core.init().then(() => {
    if (!core.state.finishedSetup) {
      router.push("/setup");
    }
    console.info("[TPU/CoreStore] Core initialized");
  });
  window.central = {
    user: user.user,
    emit: (platform: string, event: string, data: any) => {
      if (platform === "geo" && event === "history") {
        console.log(data);
      }
    }
  };
}
