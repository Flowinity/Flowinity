import { ref, computed, markRaw, type Raw, watch, h } from "vue";
import { defineStore, getActivePinia } from "pinia";
import RiAndroidFill, {
  type SVGComponent
} from "vue-remix-icons/icons/ri-android-fill.vue";
import RiAndroidLine from "vue-remix-icons/icons/ri-android-line.vue";
import RiChat1Line from "vue-remix-icons/icons/ri-chat-1-line.vue";
import RiChat1Fill from "vue-remix-icons/icons/ri-chat-1-fill.vue";
import RiCollageFill from "vue-remix-icons/icons/ri-collage-fill.vue";
import RiCollageLine from "vue-remix-icons/icons/ri-collage-line.vue";
import RiDashboardLine from "vue-remix-icons/icons/ri-dashboard-line.vue";
import RiFileTextFill from "vue-remix-icons/icons/ri-file-text-fill.vue";
import RiFileTextLine from "vue-remix-icons/icons/ri-file-text-line.vue";
import RiFolderImageLine from "vue-remix-icons/icons/ri-folder-image-line.vue";
import RiGalleryLine from "vue-remix-icons/icons/ri-gallery-line.vue";
import RiGiftFill from "vue-remix-icons/icons/ri-gift-fill.vue";
import RiGiftLine from "vue-remix-icons/icons/ri-gift-line.vue";
import RiGroupFill from "vue-remix-icons/icons/ri-group-fill.vue";
import RiGroupLine from "vue-remix-icons/icons/ri-group-line.vue";
import RiHome5Fill from "vue-remix-icons/icons/ri-home-5-fill.vue";
import RiHome5Line from "vue-remix-icons/icons/ri-home-5-line.vue";
import RiImage2Fill from "vue-remix-icons/icons/ri-image-2-fill.vue";
import RiImage2Line from "vue-remix-icons/icons/ri-image-2-line.vue";
import RiInformationFill from "vue-remix-icons/icons/ri-information-fill.vue";
import RiInformationLine from "vue-remix-icons/icons/ri-information-line.vue";
import RiLineChartFill from "vue-remix-icons/icons/ri-line-chart-fill.vue";
import RiLineChartLine from "vue-remix-icons/icons/ri-line-chart-line.vue";
import RiSettings4Line from "vue-remix-icons/icons/ri-settings-4-line.vue";
import RiSettings5Fill from "vue-remix-icons/icons/ri-settings-5-fill.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import RiSparkling2Fill from "vue-remix-icons/icons/ri-sparkling-2-fill.vue";
import RiSparkling2Line from "vue-remix-icons/icons/ri-sparkling-2-line.vue";
import RiStarFill from "vue-remix-icons/icons/ri-star-fill.vue";
import RiStarLine from "vue-remix-icons/icons/ri-star-line.vue";
import RiUserFill from "vue-remix-icons/icons/ri-user-fill.vue";
import RiUserLine from "vue-remix-icons/icons/ri-user-line.vue";
import RiDashboardFill from "vue-remix-icons/icons/ri-dashboard-fill.vue";
import RiFolderImageFill from "vue-remix-icons/icons/ri-folder-image-fill.vue";
import RiAuctionLine from "vue-remix-icons/icons/ri-auction-line.vue";
import RiAuctionFill from "vue-remix-icons/icons/ri-auction-fill.vue";
import RiMailLine from "vue-remix-icons/icons/ri-mail-line.vue";
import RiMailFill from "vue-remix-icons/icons/ri-mail-fill.vue";
import RiBug2Line from "vue-remix-icons/icons/ri-bug-2-line.vue";
import RiBug2Fill from "vue-remix-icons/icons/ri-bug-2-fill.vue";
import type { Chat, CoreState, Upload } from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { useExperimentsStore } from "@/stores/experiments.store";
import { CoreStateQuery } from "@/graphql/core/state.graphql";
import { useRoute } from "vue-router";
import { WeatherQuery } from "@/graphql/core/weather.graphql";
import { useCollectionsStore } from "@/stores/collections.store";
import type { Ref } from "vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import functions from "@/plugins/functions";
import type { AxiosProgressEvent } from "axios";
import { useToast } from "vue-toastification";
import axios from "@/plugins/axios";

export enum RailMode {
  HOME,
  GALLERY,
  CHAT,
  WORKSPACES,
  MAIL,
  ADMIN,
  DEBUG,
  SETTINGS
}

export interface NavigationOption {
  icon: Raw<SVGComponent>;
  name: string;
  path?: string;
  selectedIcon?: Raw<SVGComponent>;
  badge?: string;
  misc?: boolean;
  id?: RailMode;
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
  const weather = ref({
    loading: true,
    data: {
      description: "Clouds",
      icon: "04d",
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      name: "Australia",
      id: 2643743,
      main: "Clouds",
      location: ""
    }
  });
  const weatherTemp = computed(() => {
    const temp = weather.value.data?.temp;
    const user = useUserStore()?.user;
    if (!user?.weatherUnit) return 0;
    if (user?.weatherUnit === "kelvin") {
      // round to 2 decimal places
      return Math.round((temp + 273.15) * 100) / 100;
    } else if (user?.weatherUnit === "fahrenheit") {
      return Math.round(((temp * 9) / 5 + 32) * 100) / 100;
    } else {
      return temp;
    }
  });

  // State functions
  async function getWeather() {
    try {
      const { data } =
        await getActivePinia()._a.config.globalProperties.$apollo.query({
          query: WeatherQuery
        });
      weather.value.data = data.weather;
      weather.value.loading = false;
    } catch (e) {
      console.log(e);
    }
  }

  function loadLocalStorage() {
    const chatStore = useChatStore();
    chatStore.init();
    const userStore = useUserStore();
    const experimentsStore = useExperimentsStore();
    const core = localStorage.getItem("coreStore");
    if (core) {
      try {
        state.value = JSON.parse(core);
        loading.value = false;
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
      const userStore = useUserStore();
      window.tpuInternals = {
        lookupUser: (id) => {
          const user = userStore.users[id];
          if (!user) {
            return {
              username: "Deleted"
            };
          }
          return userStore.users[id];
        },
        lookupCollection: () => {
          return {};
        }
      };
    }
    getWeather();
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
    const collectionsStore = useCollectionsStore();
    userStore.user = currentUser;
    if (!currentUser) localStorage.removeItem("userStore");
    if (currentUser)
      localStorage.setItem("userStore", JSON.stringify(currentUser));
    userStore.tracked = trackedUsers;
    userStore.blocked = blockedUsers;
    chatStore.chats = chats.map((chat: Chat) => {
      return {
        ...chat,
        messages: chatStore.chats.find((c) => c.id === chat.id)?.messages
      };
    });
    chatStore.emoji = userEmoji;
    for (const experiment of experiments) {
      experimentsStore.experiments[experiment.id] = experiment.value;
    }
    if (collections) {
      collectionsStore.items = collections.items;
      collectionsStore.pager = collections.pager;
    }
    loading.value = false;
  }

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

  const userStore = useUserStore();

  // Navigation
  const drawer = ref(false);
  const navigation = ref({
    mode:
      parseInt(localStorage.getItem("railMode") || "0") ||
      (RailMode.HOME as RailMode),
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
        }
      ],
      [RailMode.CHAT]: [],
      [RailMode.WORKSPACES]: [],
      [RailMode.SETTINGS]: [],
      [RailMode.ADMIN]: [],
      [RailMode.MAIL]: [],
      [RailMode.DEBUG]: []
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
      }
    ] as NavigationOption[]
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      if (navigation.value.mode <= 0) return;
      navigation.value.mode--;
    } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
      if (navigation.value.mode >= navigation.value.railOptions.length - 1)
        return;
      navigation.value.mode++;
    }
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

  const currentNavOptions = computed(() => {
    return navigation.value.options[navigation.value.mode as RailMode];
  });

  const currentMiscNavOptions = computed(() => {
    return navigation.value.miscOptions[navigation.value.mode as RailMode];
  });

  const route = useRoute();
  const collectionsStore = useCollectionsStore();
  const chatStore = useChatStore();

  const currentNavItem = computed(() => {
    if (
      route.path.startsWith("/collections/") ||
      route.path.startsWith("/auto-collects/")
    ) {
      const find = collectionsStore.items.find(
        (collection) => collection.id === parseInt(<string>route.params.id)
      );
      return {
        item: {
          name: find?.name,
          icon: markRaw(RiCollageLine),
          path: route.path,
          selectedIcon: markRaw(RiCollageFill)
        },
        rail: navigation.value.railOptions.find(
          (rail) => rail.id === RailMode.GALLERY
        )
      };
    } else if (route.path.startsWith("/communications/")) {
      const find = chatStore.chats.find(
        (chat) => chat.association?.id === parseInt(<string>route.params.id)
      );
      return {
        item: {
          name: find ? chatStore.chatName(find) : "Flowinity",
          icon: h(UserAvatar, {
            username: chatStore.chatName(<Chat>find),
            userId: find?.recipient?.id,
            src: find?.recipient ? undefined : functions.avatar(find),
            size: 32
          }),
          path: route.path,
          selectedIcon: markRaw(RiCollageFill)
        },
        rail: navigation.value.railOptions.find(
          (rail) => rail.id === RailMode.CHAT
        )
      };
    }
    const lookup = lookupNav.value[route.path];
    if (!lookup) return null;
    return {
      item: lookup,
      rail: navigation.value.railOptions.find(
        (rail) => rail.id === lookup._rail
      )
    };
  });

  // Dialogs
  const dialogs = ref({
    gallery: {
      delete: {
        value: false,
        upload: null as Upload | null,
        bulkIds: [] as number[]
      },
      collect: {
        value: false,
        items: [] as number[]
      },
      upload: {
        value: false,
        files: [] as File[],
        loading: false,
        percentage: 0
      },
      ocr: {
        value: false,
        content: ""
      },
      edit: {
        value: false,
        upload: null as Upload | null
      }
    },
    tutorials: {
      actionBar: {
        value: false
      }
    }
  });

  const appBarImage: Ref<string | null> = ref(null);

  const heightOffset = computed(() => {
    console.log(appBarImage.value);
    return "h-full";
  });

  const scrollPosition = ref(0);

  document.addEventListener("scroll", (ev) => {
    scrollPosition.value = Math.ceil(window.scrollY);
  });

  async function upload() {
    try {
      const appStore = useAppStore();
      const toast = useToast();
      if (!dialogs.value.gallery.upload.files.length)
        toast.error("No files selected!");
      const formData = new FormData();
      for (const file of dialogs.value.gallery.upload.files) {
        formData.append("attachments", file);
      }
      dialogs.value.gallery.upload.loading = true;
      const { data } = await axios.post("/gallery/site", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;
          dialogs.value.gallery.upload.percentage = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
        }
      });
      if (dialogs.value.gallery.upload.files.length === 1) {
        functions.copy(data[0].url);
        toast.success(
          "Successfully uploaded file and copied Flowinity link to clipboard!"
        );
      } else {
        toast.success("Successfully uploaded files!");
      }
      dialogs.value.gallery.upload.value = false;
      dialogs.value.gallery.upload.files = [];
      dialogs.value.gallery.upload.percentage = 0;
      dialogs.value.gallery.upload.loading = false;
    } catch (e) {
      console.log(e);
      dialogs.value.gallery.upload.percentage = 0;
      dialogs.value.gallery.upload.loading = false;
      return e;
    }
  }

  return {
    navigation,
    currentRail,
    currentNavOptions,
    currentMiscNavOptions,
    state,
    title,
    init,
    loading,
    domain,
    currentNavItem,
    weather,
    weatherTemp,
    drawer,
    dialogs,
    appBarImage,
    heightOffset,
    scrollPosition,
    upload
  };
});
