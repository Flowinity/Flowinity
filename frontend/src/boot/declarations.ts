import { useUserStore } from "@/store/user.store";
import { useAppStore } from "@/store/app.store";
import { useExperimentsStore } from "@/store/experiments.store";
import dayjs from "@/plugins/dayjs";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections.store";
import { ToastInterface } from "vue-toastification";
import validation from "@/plugins/validation";
import { useWorkspacesStore } from "@/store/workspaces.store";
import { useChatStore } from "@/store/chat.store";
import { Socket } from "socket.io-client";
import { useFriendsStore } from "@/store/friends.store";
import { useMailStore } from "@/store/mail.store";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { useAdminStore } from "@/store/admin.store";
import { Axios } from "axios";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";
import { Collection } from "@/models/collection";
import { ApolloClient } from "@apollo/client/core";

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
    $apollo: ApolloClient<any>;
    $sockets: {
      chat: Socket;
      pulse: Socket;
      friends: Socket;
      mail: Socket;
      user: Socket;
      autoCollects: Socket;
      gallery: Socket;
      trackedUsers: Socket;
    };
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
      $sockets: Record<string, Socket>;
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
