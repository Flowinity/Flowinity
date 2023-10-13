import { ref, computed, markRaw, type Raw } from "vue";
import { defineStore } from "pinia";
import {
  RiAndroidFill,
  RiAndroidLine,
  RiChat1Line,
  RiDashboardLine,
  RiFileTextFill,
  RiFileTextLine,
  RiGalleryLine,
  RiGiftFill,
  RiGiftLine,
  RiGroupFill,
  RiGroupLine,
  RiHome5Fill,
  RiHome5Line,
  RiInformationFill,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiSettings4Line,
  RiSettings5Fill,
  RiSettings5Line,
  RiUserFill,
  RiUserLine,
  type SVGComponent
} from "vue-remix-icons";
import type { CoreState } from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { useExperimentsStore } from "@/stores/experiments.store";
import { CoreStateQuery } from "@/graphql/core/state.graphql";

export enum RailMode {
  HOME,
  GALLERY,
  CHAT,
  WORKSPACES
}

export interface NavigationOption {
  icon: Raw<SVGComponent>;
  name: string;
  path: string;
  selectedIcon: Raw<SVGComponent>;
}

export const useAppStore = defineStore("app", () => {
  // State
  const state = ref<CoreState>({
    release: "prod",
    name: "Flowinity"
  } as CoreState);

  const title = ref("");
  const loading = ref(true);
  const domain = computed(() => {
    return state.value.domain ? `https://${state.value.domain}/i/` : "/i/";
  });

  // State functions
  function loadLocalStorage() {
    const chatStore = useChatStore();
    chatStore.init();
    const userStore = useUserStore();
    const experimentsStore = useExperimentsStore();
    const core = localStorage.getItem("coreStore");
    if (core) {
      try {
        state.value = JSON.parse(core);
        laoding.value = false;
      } catch {
        //
      }
    }
    const user = localStorage.getItem("userStore");
    if (user) {
      try {
        userStore.user = JSON.parse(user);
      } catch {
        //
      }
    }
    const tracked = localStorage.getItem("trackedUsersStore");
    if (tracked) {
      try {
        userStore.tracked = JSON.parse(tracked);
      } catch {
        //
      }
    }
    let experiments: any = localStorage.getItem("experimentsStore");
    if (experiments) {
      try {
        experiments = JSON.parse(experiments);
        for (const experiment of experiments) {
          experimentsStore.experiments[experiment.id] = experiment.value;
        }
      } catch {
        //
      }
    }
  }

  async function init() {
    loading.value = true;
    loadLocalStorage();
    if (!window.tpuInternals) {
      window.tpuInternals = {};
    }
    const {
      data: {
        coreState,
        experiments,
        currentUser,
        collections,
        chats,
        workspaces,
        friends,
        trackedUsers,
        blockedUsers,
        userEmoji
      }
    } = await this.$apollo.query({
      query: CoreStateQuery,
      fetchPolicy: "no-cache"
    });
    state.value = coreState;
    const userStore = useUserStore();
    const chatStore = useChatStore();
    const experimentsStore = useExperimentsStore();
    userStore.user = currentUser;
    userStore.tracked = trackedUsers;
    userStore.blocked = blockedUsers;
    chatStore.chats = chats.map((chat) => {
      return {
        ...chat,
        messages: chatStore.chats.find((c) => c.id === chat.id)?.messages
      };
    });
    for (const experiment of experiments) {
      experimentsStore.experiments[experiment.id] = experiment.value;
    }
    loading.value = false;
  }

  // Navigation
  const navigation = ref({
    mode: RailMode.HOME as RailMode,
    options: {
      [RailMode.HOME]: [
        {
          icon: markRaw(RiHome5Line),
          name: "Home",
          path: "/",
          selectedIcon: markRaw(RiHome5Fill)
        },
        {
          icon: markRaw(RiLineChartLine),
          name: "Insights",
          path: "/insights",
          selectedIcon: markRaw(RiLineChartFill)
        },
        {
          icon: markRaw(RiGroupLine),
          name: "Friends",
          path: "/friends",
          selectedIcon: markRaw(RiGroupFill)
        },
        {
          icon: markRaw(RiUserLine),
          name: "My Profile",
          path: "/profile",
          selectedIcon: markRaw(RiUserFill)
        },
        {
          icon: markRaw(RiSettings5Line),
          name: "Settings",
          path: "/settings",
          selectedIcon: markRaw(RiSettings5Fill)
        }
      ],
      [RailMode.GALLERY]: [],
      [RailMode.CHAT]: [],
      [RailMode.WORKSPACES]: []
    } as Record<RailMode, NavigationOption[]>,
    miscOptions: {
      [RailMode.HOME]: [
        {
          icon: markRaw(RiGiftLine),
          name: "Invite a Friend",
          path: "",
          selectedIcon: markRaw(RiGiftFill)
        },
        {
          icon: markRaw(RiAndroidLine),
          name: "Get the App",
          path: "",
          selectedIcon: markRaw(RiAndroidFill)
        },
        {
          icon: markRaw(RiInformationLine),
          name: "About Flowinity",
          path: "/settings/about",
          selectedIcon: markRaw(RiInformationFill)
        }
      ]
    } as Record<RailMode, NavigationOption[]>,
    railOptions: [
      {
        icon: markRaw(RiDashboardLine),
        name: "Dashboard",
        id: RailMode.HOME
      },
      {
        icon: markRaw(RiGalleryLine),
        name: "Gallery",
        id: RailMode.GALLERY
      },
      {
        icon: markRaw(RiChat1Line),
        name: "Chat",
        id: RailMode.CHAT
      },
      {
        icon: markRaw(RiFileTextLine),
        name: "Workspaces",
        id: RailMode.WORKSPACES
      }
    ]
  });

  const currentRail = computed(() => {
    return navigation.value.railOptions.find(
      (rail) => rail.id === navigation.value.mode
    );
  });

  const currentNavOptions = computed(() => {
    return navigation.value.options[navigation.value.mode];
  });

  const currentMiscNavOptions = computed(() => {
    return navigation.value.miscOptions[navigation.value.mode];
  });

  return {
    navigation,
    currentRail,
    currentNavOptions,
    currentMiscNavOptions,
    state,
    title,
    init,
    loading,
    domain
  };
});
