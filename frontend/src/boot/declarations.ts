import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { useExperimentsStore } from "@/store/experiments";
import dayjs from "@/plugins/dayjs";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections";
import { ToastInterface } from "vue-toastification";
import validation from "@/plugins/validation";
import { useWorkspacesStore } from "@/store/workspaces";
import { useChatStore } from "@/store/chat";
import { Socket } from "socket.io-client";
import { useFriendsStore } from "@/store/friends";
import { useMailStore } from "@/store/mail";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { useAdminStore } from "@/store/admin";
import { Axios } from "axios";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";
import { Collection } from "@/models/collection";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $user: ReturnType<typeof useUserStore>;
    $app: ReturnType<typeof useAppStore>;
    $experiments: ReturnType<typeof useExperimentsStore>;
    $date: typeof dayjs;
    $functions: typeof functions;
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: ToastInterface;
    $validation: typeof validation;
    $workspaces: ReturnType<typeof useWorkspacesStore>;
    $chat: ReturnType<typeof useChatStore>;
    $socket: Socket;
    $friends: ReturnType<typeof useFriendsStore>;
    $mail: ReturnType<typeof useMailStore>;
    $router: Router;
    $route: RouteLocationNormalizedLoaded;
    $admin: ReturnType<typeof useAdminStore>;
    axios: Axios;
  }
}

declare global {
  interface Window {
    socket: Socket;
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
    cordova?: any;
    central: {
      user: any;
      emit: (platform: string, event: string, data: any) => void;
    };
  }

  interface navigator extends Navigator {
    getBattery: () => Promise<any>;
  }
}
