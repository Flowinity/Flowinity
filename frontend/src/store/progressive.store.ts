/**
 * @fileoverview progressive UI store
 * @module store/progressive
 * @description The store for the new "Progressive UI" overhaul features for TPUv4. Manages railbar and sidebar state.
 */

import { defineStore } from "pinia";
import { computed, markRaw, Raw, Ref, ref, watch } from "vue";
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
  RiWebhookFill
} from "@remixicon/vue";
import { useUserStore } from "@/store/user.store";
import { useRoute } from "vue-router";
import { useCollectionsStore } from "@/store/collections.store";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";

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
  COLLECTIONS
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
          icon: markRaw(RiGroupLine),
          name: "Friends",
          path: "/friends",
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
          path: "/auto-collects",
          selectedIcon: markRaw(RiSparkling2Fill),
          badge: userStore.user?.pendingAutoCollects || ""
        },
        {
          icon: markRaw(RiSlideshow2Line),
          name: "Slideshows",
          path: "/slideshows",
          selectedIcon: markRaw(RiSlideshow2Fill)
        }
      ],
      [RailMode.CHAT]: [],
      [RailMode.WORKSPACES]: [],
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
          name: "Setup",
          path: "/settings/setup",
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
      [RailMode.COLLECTIONS]: []
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
        selectedIcon: markRaw(RiVideoChatFill)
      },
      {
        icon: markRaw(RiMailLine),
        name: "Mail",
        id: RailMode.MAIL,
        path: "/mail",
        selectedIcon: markRaw(RiMailFill)
      },
      {
        icon: markRaw(RiAuctionLine),
        name: "Admin",
        id: RailMode.ADMIN,
        path: "/admin",
        selectedIcon: markRaw(RiAuctionFill)
      },
      {
        icon: markRaw(RiBug2Line),
        name: "Debug",
        id: RailMode.DEBUG,
        path: "/debug",
        selectedIcon: markRaw(RiBug2Fill)
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
        path: "/auto-collects",
        fake: true
      },
      {
        icon: markRaw(RiCollageLine),
        name: "Collections",
        id: RailMode.COLLECTIONS,
        selectedIcon: markRaw(RiCollageFill),
        path: "/gallery",
        fake: true
      }
    ] as NavigationOption[]
  });

  const shifting = ref(false);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;
    shifting.value = e.shiftKey;

    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      if (navigation.value.mode <= 0) return;
      navigation.value.mode--;
    } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
      if (navigation.value.mode > RailMode.SETTINGS - 1) return;
      navigation.value.mode++;
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
        (item) => item.path === "/auto-collects"
      );
      if (!item) return;
      item.badge = !val ? undefined : val.toString();
    }
  );

  const currentRail = computed(() => {
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
    lookupNav
  };
});
