/**
 * @fileoverview progressive UI store
 * @module store/progressive
 * @description The store for the new "Progressive UI" overhaul features for TPUv4 (TPUv5in4). Manages railbar and sidebar state.
 */

import { defineStore } from "pinia";
import { computed, h, markRaw, Raw, Ref, ref, watch } from "vue";
import {
  RiAddLine,
  RiAppleFill,
  RiAppleLine,
  RiAuctionFill,
  RiAuctionLine,
  RiBug2Fill,
  RiBug2Line,
  RiChat1Fill,
  RiChat1Line,
  RiCodeFill,
  RiCodeLine,
  RiCollageFill,
  RiCollageLine,
  RiDashboardFill,
  RiDashboardLine,
  RiDownloadFill,
  RiDownloadLine,
  RiFileTextFill,
  RiFileTextLine,
  RiFolderImageFill,
  RiFolderImageLine,
  RiGiftFill,
  RiGiftLine,
  RiGlobalLine,
  RiGroup2Fill,
  RiGroup2Line,
  RiGroupFill,
  RiGroupLine,
  RiHome5Fill,
  RiHome5Line,
  RiImage2Fill,
  RiImage2Line,
  RiInformationFill,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiLink,
  RiLockFill,
  RiLockLine,
  RiMailFill,
  RiMailLine,
  RiMicrosoftFill,
  RiMicrosoftLine,
  RiRefreshFill,
  RiRefreshLine,
  RiSettings5Fill,
  RiSettings5Line,
  RiShieldUserFill,
  RiShieldUserLine,
  RiSlideshow2Fill,
  RiSlideshow2Line,
  RiSparkling2Fill,
  RiSparkling2Line,
  RiStarFill,
  RiStarLine,
  RiToolsFill,
  RiToolsLine,
  RiUserFill,
  RiUserLine,
  RiVideoChatFill,
  RiVideoChatLine,
  RiWindowsLine
} from "@remixicon/vue";
import { useUserStore } from "@/store/user.store";
import { useRoute } from "vue-router";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { Platform, useAppStore } from "@/store/app.store";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { PartialUserBase, PartialUserFriend, User } from "@/gql/graphql";
import { useMailStore } from "@/store/mail.store";
import { useFriendsStore } from "@/store/friends.store";
import { VIcon } from "vuetify/components";
import functions from "@/plugins/functions";

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
  scopesRequired?: string[];
}

export const useProgressiveUIStore = defineStore("progressive", () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const mailStore = useMailStore();
  const friendStore = useFriendsStore();
  const appStore = useAppStore();
  const drawer = ref(false);
  const ready = ref(false);
  const lookupNav = computed(() => {
    const pathToOption: Record<string, NavigationOption & { _rail: number }> =
      {};
    for (const railMode of navigation.value.railOptions) {
      for (const option of [
        ...(navigation.value.options[railMode.id] || []),
        ...(navigation.value.miscOptions[railMode.id] || [])
      ]) {
        pathToOption[<string>option.path] = {
          ...option,
          _rail: railMode.id
        };
      }
    }
    return pathToOption;
  });
  const navigationMode = ref<RailMode>(
    parseInt(localStorage.getItem("railMode") || "0") ||
      (RailMode.HOME as RailMode as RailMode)
  );
  const navigation = computed({
    get() {
      return {
        mode: navigationMode.value,
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
              selectedIcon: markRaw(RiLineChartFill),
              scopesRequired: ["insights.view"]
            },
            {
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
              selectedIcon: markRaw(RiImage2Fill),
              scopesRequired: ["gallery.view"]
            },
            {
              icon: markRaw(RiStarLine),
              name: "Starred",
              path: "/starred",
              selectedIcon: markRaw(RiStarFill),
              scopesRequired: ["starred.view"]
            },
            {
              icon: markRaw(RiSparkling2Line),
              name: `AutoCollects`,
              path: "/autoCollect",
              selectedIcon: markRaw(RiSparkling2Fill),
              badge: userStore.user?.pendingAutoCollects || "",
              scopesRequired: ["collections.view"]
            },
            {
              icon: markRaw(RiSlideshow2Line),
              name: "Slideshows",
              path: "/settings/slideshows",
              selectedIcon: markRaw(RiSlideshow2Fill),
              scopesRequired: ["user.modify"]
            }
          ],
          [RailMode.CHAT]: [
            {
              icon: markRaw(RiGroup2Line),
              name: "Social Hub",
              path: "/communications/home",
              selectedIcon: markRaw(RiGroup2Fill),
              badge: friendStore.incomingFriends.length
                ? friendStore.incomingFriends.length.toLocaleString()
                : undefined,
              scopesRequired: ["user.view"]
            },
            {
              icon: markRaw(RiAddLine),
              name: "Join or Create",
              click: () => {
                appStore.dialogs.createChat = true;
              },
              selectedIcon: markRaw(RiChat1Fill),
              scopesRequired: ["chats.create"]
            }
            /*   ...chatStore.chats.map((chat) => ({
              icon: markRaw(
                h(UserAvatar, {
                  chat: chat.recipient ? undefined : chat,
                  user: chat.recipient
                    ? userStore.users[chat.recipient.id]
                    : undefined,
                  size: 40,
                  status: true,
                  dotStatus: true
                })
              ),
              name: chatStore.chatName(chat),
              path: `/communications/${chat.association.id}`,
              badge: chat.unread ? chat.unread.toLocaleString() : undefined
            }))*/
          ],
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
              icon: h(VIcon, {
                icon: "mdi-plus"
              }),
              name: "Flowinity Pro",
              path: "/settings/subscriptions",
              selectedIcon: h(VIcon, {
                icon: "mdi-plus"
              })
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
            } /*
        {
          icon: markRaw(RiWebhookLine),
          name: "Webhooks",
          path: "/settings/webhooks",
          selectedIcon: markRaw(RiWebhookFill)
        },*/,
            {
              icon: markRaw(RiCodeLine),
              name: "Developer Portal",
              path: "/settings/developer",
              selectedIcon: markRaw(RiCodeFill)
            },
            ...(appStore.platform !== Platform.WEB
              ? [
                  {
                    icon: markRaw(
                      appStore.platform === Platform.WINDOWS
                        ? RiMicrosoftLine
                        : appStore.platform === Platform.MAC
                          ? RiAppleLine
                          : h(VIcon, {
                              icon: "mdi-linux"
                            })
                    ),
                    name: "Desktop Settings",
                    path: "/settings/desktop",
                    selectedIcon: markRaw(
                      appStore.platform === Platform.WINDOWS
                        ? RiMicrosoftFill
                        : appStore.platform === Platform.MAC
                          ? RiAppleFill
                          : h(VIcon, {
                              icon: "mdi-linux"
                            })
                    )
                  }
                ]
              : []),
            {
              icon: markRaw(RiInformationLine),
              name: "About",
              path: "/settings/about",
              selectedIcon: markRaw(RiInformationFill)
            }
          ],
          [RailMode.ADMIN]: [
            {
              icon: null,
              name: `Access Level: ${userStore.user?.administrator ? "Admin" : userStore.user?.moderator ? "Moderator" : "User"}`,
              path: "",
              selectedIcon: null
            },
            {
              icon: markRaw(RiDashboardLine),
              name: "Dashboard",
              path: "/admin/dashboard",
              selectedIcon: markRaw(RiDashboardFill)
            },
            {
              icon: markRaw(RiGroupLine),
              name: "Users",
              path: "/admin/users",
              selectedIcon: markRaw(RiGroupFill)
            },
            {
              icon: markRaw(RiGiftLine),
              name: "Invite a Friend",
              path: "/admin/invites",
              selectedIcon: markRaw(RiGiftFill)
            },
            {
              icon: markRaw(RiGlobalLine),
              name: "Domains",
              path: "/admin/domains",
              selectedIcon: markRaw(RiGlobalLine)
            },
            {
              icon: markRaw(RiRefreshLine),
              name: "Caching",
              path: "/admin/cache",
              selectedIcon: markRaw(RiRefreshFill)
            },
            {
              icon: markRaw(RiChat1Line),
              name: "Communications",
              path: "/admin/communications",
              selectedIcon: markRaw(RiChat1Fill)
            },
            {
              icon: markRaw(RiStarLine),
              name: "Badges",
              path: "/admin/badges",
              selectedIcon: markRaw(RiStarFill)
            },
            {
              icon: markRaw(RiSparkling2Line),
              name: "AutoCollects",
              path: "/admin/autoCollect",
              selectedIcon: markRaw(RiSparkling2Fill)
            },
            {
              icon: markRaw(RiLockLine),
              name: "AppAuth / Developer",
              path: "/admin/oauth",
              selectedIcon: markRaw(RiLockFill)
            }
          ],
          [RailMode.MAIL]: mailStore.mailboxes.map((mailbox) => ({
            icon: markRaw(RiMailLine),
            name: mailbox.name === "INBOX" ? "Inbox" : mailbox.name,
            path: `/mail/${mailbox.path}`,
            selectedIcon: markRaw(RiMailFill),
            badge: mailbox.unread ? mailbox.unread.toLocaleString() : undefined
          })),
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
                appStore.dialogs.inviteAFriend = true;
              }
            },
            {
              icon: markRaw(RiDownloadLine),
              name: "Get the App",
              path: "/downloads",
              selectedIcon: markRaw(RiDownloadFill)
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
            selectedIcon: markRaw(RiFolderImageFill),
            badge: userStore.user?.pendingAutoCollects || "",
            scopesRequired: ["gallery", "starred", "collections"]
          },
          {
            icon: markRaw(RiChat1Line),
            name: "Comms",
            id: RailMode.CHAT,
            path: "/communications",
            selectedIcon: markRaw(RiChat1Fill),
            badge: chatStore.totalUnread
              ? chatStore.totalUnread.toLocaleString()
              : undefined,
            experimentsRequired: ["COMMUNICATIONS"],
            scopesRequired: ["chats.view"]
          },
          {
            icon: markRaw(RiFileTextLine),
            name: "Workspaces",
            id: RailMode.WORKSPACES,
            path: "/workspaces",
            selectedIcon: markRaw(RiFileTextFill),
            experimentsRequired: ["INTERACTIVE_NOTES"],
            scopesRequired: ["workspaces.view"]
          },
          {
            icon: markRaw(RiVideoChatLine),
            name: "Meet",
            id: RailMode.MEET,
            path: "/meet",
            selectedIcon: markRaw(RiVideoChatFill),
            experimentsRequired: ["MEET"],
            scopesRequired: ["meet.view"]
          },
          {
            icon: markRaw(RiMailLine),
            name: "Mail",
            id: RailMode.MAIL,
            path: "/mail",
            selectedIcon: markRaw(RiMailFill),
            experimentsRequired: ["WEBMAIL"],
            badge: mailStore.unread
              ? mailStore.unread.toLocaleString()
              : undefined,
            scopesRequired: ["mail.view"]
          },
          {
            icon: markRaw(RiAuctionLine),
            name: "Admin",
            id: RailMode.ADMIN,
            path: "/admin",
            selectedIcon: markRaw(RiAuctionFill),
            experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"],
            scopesRequired: ["*"]
          },
          {
            icon: markRaw(RiBug2Line),
            name: "Debug",
            id: RailMode.DEBUG,
            path: "",
            selectedIcon: markRaw(RiBug2Fill),
            experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
          },
          {
            icon: markRaw(RiSettings5Line),
            name: "Settings",
            id: RailMode.SETTINGS,
            path: "/settings",
            selectedIcon: markRaw(RiSettings5Fill),
            misc: true,
            scopesRequired: ["user.modify"]
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
        ]
      };
    },
    set() {
      console.warn("Cannot set navigation");
    }
  });

  const shifting = ref(false);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;

    shifting.value = e.shiftKey;

    const eligible = navigation.value.railOptions.filter((rail) => {
      if (rail.fake) return false;
      if (!rail.experimentsRequired) return true;

      return (
        rail.experimentsRequired.every((exp) => experiments.experiments[exp]) &&
        (!rail.scopesRequired ||
          rail.scopesRequired.every((scope) =>
            functions.checkScope(scope, userStore.user?.scopes || "")
          ))
      );
    });

    // Sort eligible rails by id in ascending order
    eligible.sort((a, b) => a.id - b.id);
    const currentIndex = eligible.findIndex(
      (rail) => rail.id === navigation.value.mode
    );
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      if (navigation.value.mode <= 0) return;
      navigationMode.value = eligible[currentIndex - 1]?.id || 0;
    } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
      e.preventDefault();
      if (!eligible[currentIndex + 1]) return;
      navigationMode.value = eligible[currentIndex + 1]?.id || 0;
    }
  });

  document.addEventListener("keyup", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;
    if (!shifting.value) return;
    shifting.value = false;
  });

  const currentRail = computed(() => {
    if (!navigationMode.value) return navigation.value.railOptions[0];
    return navigation.value.railOptions.find(
      (rail) => rail.id === navigationMode.value
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
        rail: useExperimentsStore().experiments.BREADCRUMB_SHOW_PARENT
          ? [
              navigation.value.railOptions.find(
                (rail) => rail.id === lookup._rail
              )
            ]
          : []
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
    userRail,
    ready,
    navigationMode
  };
});
