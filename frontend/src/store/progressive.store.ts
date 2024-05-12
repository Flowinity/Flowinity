/**
 * @fileoverview progressive UI store
 * @module store/progressive
 * @description The store for the new "Progressive UI" overhaul features for TPUv4 (TPUv5in4). Manages railbar and sidebar state.
 */

import { defineStore } from "pinia";
import { computed, h, markRaw, Raw, Ref, ref, watch } from "vue";
import {
  RiGroupFill,
  RiGroupLine,
  RiHome5Fill,
  RiHome5Line,
  RiLineChartFill,
  RiLineChartLine,
  RiStarFill,
  RiUserFill,
  RiUserLine,
  RiImage2Fill,
  RiImage2Line,
  RiStarLine,
  RiSparkling2Fill,
  RiSparkling2Line,
  RiSlideshow2Fill,
  RiSlideshow2Line,
  RiGiftFill,
  RiGiftLine,
  RiAndroidFill,
  RiAndroidLine,
  RiInformationFill,
  RiInformationLine,
  RiDashboardFill,
  RiDashboardLine,
  RiFolderImageFill,
  RiFolderImageLine,
  RiChat1Fill,
  RiChat1Line,
  RiFileTextFill,
  RiFileTextLine,
  RiVideoChatFill,
  RiVideoChatLine,
  RiMailFill,
  RiMailLine,
  RiAuctionFill,
  RiAuctionLine,
  RiBug2Fill,
  RiBug2Line,
  RiSettings5Fill,
  RiSettings5Line,
  RiShieldUserFill,
  RiShieldUserLine,
  RiLockFill,
  RiLockLine,
  RiToolsFill,
  RiToolsLine,
  RiGlobalLine,
  RiLink,
  RiWebhookLine,
  RiCodeLine,
  RiCodeFill,
  RiCollageFill,
  RiCollageLine,
  RiWebhookFill,
  RiGroup2Line,
  RiGroup2Fill
} from "@remixicon/vue";
import { useUserStore } from "@/store/user.store";
import { useRoute } from "vue-router";
import { useCollectionsStore } from "@/store/collections.store";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useAppStore } from "@/store/app.store";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { PartialUserBase, PartialUserFriend, User } from "@/gql/graphql";

export enum RailMode {
  HOME,
  GALLERY,
  CHAT,
  WORKSPACES,
  MEET,
  MAIL,
  ADMIN,
  DEBUG,
  SETTINGS,
  // Fake rail-modes
  AUTO_COLLECTS,
  COLLECTIONS,
  USERS
}

export interface NavigationOption {
  icon: Raw<any>;
  name: string;
  path?: string;
  selectedIcon?: Raw<any>;
  badge?: string;
  misc?: boolean;
  id?: RailMode;
  fake?: boolean;
  allowOverride?: boolean;
  rail?: NavigationOption;
  click?: () => void;
  experimentsRequired?: string[];
}

export const useProgressiveUIStore = defineStore("progressive", () => {
  const userStore = useUserStore();
  const drawer = ref(false);
  const lookupNav = computed(() => {
    const pathToOption: Record<string, NavigationOption & { _rail: number }> =
      {};
    for (const railMode of navigation.value.railOptions) {
      for (const option of navigation.value.options[railMode.id]) {
        pathToOption[<string>option.path] = {
          ...option,
          _rail: railMode.id
        };
      }
    }
    return pathToOption;
  });
  const navigation = ref({
    mode:
      parseInt(localStorage.getItem("railMode") || "0") ||
      (RailMode.HOME as RailMode as RailMode),
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
          icon: markRaw(RiGroup2Line),
          name: "Social Hub",
          path: "/communications/home",
          selectedIcon: markRaw(RiGroup2Fill)
        },
        {
          // Users
          icon: markRaw(RiGroupLine),
          name: "Users",
          path: "/users",
          selectedIcon: markRaw(RiGroupFill)
        },
        {
          icon: markRaw(RiUserLine),
          name: "My Profile",
          path: `/u/${userStore.user?.username}`,
          selectedIcon: markRaw(RiUserFill),
          allowOverride: true
        }
      ],
      [RailMode.GALLERY]: [
        {
          icon: markRaw(RiImage2Line),
          name: "My Gallery",
          path: "/gallery",
          selectedIcon: markRaw(RiImage2Fill)
        },
        {
          icon: markRaw(RiStarLine),
          name: "Starred",
          path: "/starred",
          selectedIcon: markRaw(RiStarFill)
        },
        {
          icon: markRaw(RiSparkling2Line),
          name: `AutoCollects`,
          path: "/autoCollect",
          selectedIcon: markRaw(RiSparkling2Fill),
          badge: userStore.user?.pendingAutoCollects || ""
        },
        {
          icon: markRaw(RiSlideshow2Line),
          name: "Slideshows",
          path: "/settings/slideshows",
          selectedIcon: markRaw(RiSlideshow2Fill)
        }
      ],
      [RailMode.CHAT]: [],
      [RailMode.WORKSPACES]: [
        {
          icon: markRaw(RiFileTextLine),
          name: "Recent",
          path: "/workspaces",
          selectedIcon: markRaw(RiFileTextFill)
        }
      ],
      [RailMode.SETTINGS]: [
        {
          icon: markRaw(RiUserLine),
          name: "My Account",
          path: "/settings/dashboard",
          selectedIcon: markRaw(RiUserFill)
        },
        {
          icon: markRaw(RiShieldUserLine),
          name: "Privacy",
          path: "/settings/privacy",
          selectedIcon: markRaw(RiShieldUserFill)
        },
        {
          icon: markRaw(RiLockLine),
          name: "Security",
          path: "/settings/security",
          selectedIcon: markRaw(RiLockFill)
        },
        {
          icon: markRaw(RiToolsLine),
          name: "Setup & Clients",
          path: "/settings/clients",
          selectedIcon: markRaw(RiToolsFill)
        },
        {
          icon: markRaw(RiGlobalLine),
          name: "Domains",
          path: "/settings/domains",
          selectedIcon: markRaw(RiGlobalLine)
        },
        {
          icon: markRaw(RiLink),
          name: "Linked Applications",
          path: "/settings/integrations",
          selectedIcon: markRaw(RiLink)
        },
        {
          icon: markRaw(RiWebhookLine),
          name: "Webhooks",
          path: "/settings/webhooks",
          selectedIcon: markRaw(RiWebhookFill)
        },
        {
          icon: markRaw(RiCodeLine),
          name: "Developer Portal",
          path: "/settings/developer",
          selectedIcon: markRaw(RiCodeFill)
        },
        {
          icon: markRaw(RiInformationLine),
          name: "About",
          path: "/settings/about",
          selectedIcon: markRaw(RiInformationFill)
        }
      ],
      [RailMode.ADMIN]: [],
      [RailMode.MAIL]: [],
      [RailMode.DEBUG]: [],
      [RailMode.MEET]: [],
      [RailMode.AUTO_COLLECTS]: [],
      [RailMode.COLLECTIONS]: [],
      [RailMode.USERS]: []
    } as Record<RailMode, NavigationOption[]>,
    miscOptions: {
      [RailMode.HOME]: [
        {
          icon: markRaw(RiGiftLine),
          name: "Invite a Friend",
          path: "",
          selectedIcon: markRaw(RiGiftFill),
          click: () => {
            useAppStore().dialogs.inviteAFriend = true;
          }
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
        id: RailMode.HOME,
        path: "/",
        selectedIcon: markRaw(RiDashboardFill)
      },
      {
        icon: markRaw(RiFolderImageLine),
        name: "Files",
        id: RailMode.GALLERY,
        path: "/gallery",
        selectedIcon: markRaw(RiFolderImageFill)
      },
      {
        icon: markRaw(RiChat1Line),
        name: "Comms",
        id: RailMode.CHAT,
        path: "/communications",
        selectedIcon: markRaw(RiChat1Fill)
      },
      {
        icon: markRaw(RiFileTextLine),
        name: "Workspaces",
        id: RailMode.WORKSPACES,
        path: "/workspaces",
        selectedIcon: markRaw(RiFileTextFill)
      },
      {
        icon: markRaw(RiVideoChatLine),
        name: "Meet",
        id: RailMode.MEET,
        path: "/meet",
        selectedIcon: markRaw(RiVideoChatFill),
        experimentsRequired: ["MEET"]
      },
      {
        icon: markRaw(RiMailLine),
        name: "Mail",
        id: RailMode.MAIL,
        path: "/mail",
        selectedIcon: markRaw(RiMailFill),
        experimentsRequired: ["WEBMAIL"]
      },
      {
        icon: markRaw(RiAuctionLine),
        name: "Admin",
        id: RailMode.ADMIN,
        path: "/admin",
        selectedIcon: markRaw(RiAuctionFill),
        experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
      },
      {
        icon: markRaw(RiBug2Line),
        name: "Debug",
        id: RailMode.DEBUG,
        path: "/debug",
        selectedIcon: markRaw(RiBug2Fill),
        experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
      },
      {
        icon: markRaw(RiSettings5Line),
        name: "Settings",
        id: RailMode.SETTINGS,
        path: "/settings",
        selectedIcon: markRaw(RiSettings5Fill),
        misc: true
      },
      {
        icon: markRaw(RiSparkling2Line),
        name: "AutoCollects",
        id: RailMode.AUTO_COLLECTS,
        selectedIcon: markRaw(RiSparkling2Fill),
        path: "/autoCollect",
        fake: true
      },
      {
        icon: markRaw(RiCollageLine),
        name: "Collections",
        id: RailMode.COLLECTIONS,
        selectedIcon: markRaw(RiCollageFill),
        path: "/gallery",
        fake: true
      },
      {
        icon: markRaw(RiGroupLine),
        name: "Users",
        id: RailMode.USERS,
        selectedIcon: markRaw(RiGroupFill),
        path: "/users",
        fake: true
      }
    ] as NavigationOption[]
  });

  const shifting = ref(false);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;
    shifting.value = e.shiftKey;

    const eligible = navigation.value.railOptions.filter((rail) => {
      if (rail.fake) return false;
      if (!rail.experimentsRequired) return true;
      return rail.experimentsRequired.every(
        (exp) => experiments.experiments[exp]
      );
    });

    // Sort eligible rails by id in ascending order
    eligible.sort((a, b) => a.id - b.id);
    const currentIndex = eligible.findIndex(
      (rail) => rail.id === navigation.value.mode
    );
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      if (navigation.value.mode <= 0) return;
      navigation.value.mode = eligible[currentIndex - 1].id;
    } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
      if (!eligible[currentIndex + 1]) return;
      navigation.value.mode = eligible[currentIndex + 1].id;
    }
  });

  document.addEventListener("keyup", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;
    if (!shifting.value) return;
    shifting.value = false;
  });

  watch(
    () => userStore.user?.pendingAutoCollects,
    (val) => {
      const item = navigation.value.options[RailMode.GALLERY].find(
        (item) => item.path === "/autoCollect"
      );
      if (!item) return;
      item.badge = !val ? undefined : val.toString();
    }
  );

  watch(
    () => userStore.user?.username,
    (val) => {
      const item = navigation.value.options[RailMode.HOME].find(
        (item) => item.name === "My Profile"
      );
      if (!item) return;
      item.path = `/u/${val}`;
    }
  );

  const currentRail = computed(() => {
    if (!navigation.value.mode) return navigation.value.railOptions[0];
    return navigation.value.railOptions.find(
      (rail) => rail.id === navigation.value.mode
    );
  });

  watch(
    () => currentRail.value,
    (val) => {
      if (!val) return;
      localStorage.setItem("railMode", val.id.toString());
    }
  );

  const appBarImage: Ref<string | null> = ref(null);

  const heightOffset = computed(() => {
    return "h-full";
  });

  const scrollPosition = ref(0);

  const route = useRoute();
  const _currentNavItem = ref<{
    item: NavigationOption & { _rail: number };
    rail: NavigationOption[];
  } | null>(null);

  const currentNavOptions = computed(() => {
    return navigation.value.options[navigation.value.mode as RailMode];
  });

  const currentMiscNavOptions = computed(() => {
    return navigation.value.miscOptions[navigation.value.mode as RailMode];
  });

  const currentNavItem = computed({
    get() {
      const lookup = lookupNav.value[route.path];
      if ((!lookup && _currentNavItem.value) || lookup?.allowOverride)
        return _currentNavItem.value;
      if (!lookup) return null;
      return {
        item: lookup,
        rail: [
          navigation.value.railOptions.find((rail) => rail.id === lookup._rail)
        ]
      };
    },
    set(val) {
      _currentNavItem.value = val;
    }
  });

  document.addEventListener("scroll", (ev) => {
    scrollPosition.value = Math.ceil(window.scrollY);
  });

  function userRail(
    user: User | PartialUserBase | PartialUserFriend | number | string
  ) {
    if (typeof user === "number") {
      const userStore = useUserStore();
      user = userStore.users[user];
    } else if (typeof user === "string") {
      const userStore = useUserStore();
      user = userStore.tracked.find((u) => u.username === user);
    }
    return {
      name: user?.username,
      icon: h(UserAvatar, {
        user,
        size: 30
      }),
      path: `/u/${user?.username}`
    };
  }

  return {
    drawer,
    navigation,
    appBarImage,
    heightOffset,
    scrollPosition,
    currentNavItem,
    currentNavOptions,
    currentMiscNavOptions,
    currentRail,
    shifting,
    lookupNav,
    userRail
  };
});
