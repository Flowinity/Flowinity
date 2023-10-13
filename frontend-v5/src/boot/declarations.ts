import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";
import { useExperimentsStore } from "@/stores/experiments.store";
import dayjs from "@/plugins/dayjs";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/stores/collections.store";
import { ToastInterface } from "vue-toastification";
import validation from "@/plugins/validation";
import { useWorkspacesStore } from "@/stores/workspaces.store";
import { useChatStore } from "@/stores/chat.store";
import { Socket } from "socket.io-client";
import { useFriendsStore } from "@/stores/friends.store";
import { useMailStore } from "@/stores/mail.store";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import { Axios } from "axios";
import { ApolloClient } from "@apollo/client/core";
import { User, Collection, Chat, PartialUserFriend } from "@/gql/graphql";

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
    _tpu_router: Router;
    tpuInternals: {
      processLink: (link: string) => void;
      readChat: () => void;
      lookupUser: (id: number) => PartialUserFriend;
      lookupChat: (id: number) => Chat;
      openUser: (id: number) => void;
      setChat: (id: number) => void;
      lookupCollection: (id: number) => any;
      openCollection: (id: number) => void;
      router: Router;
      pulse: Socket;
      openEmoji: (...args) => void;
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
