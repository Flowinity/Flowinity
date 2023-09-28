// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useToast } from "vue-toastification";
import functions from "@/plugins/functions";
import { AxiosProgressEvent } from "axios";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useCollectionsStore } from "@/store/collections.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import vuetify from "@/plugins/vuetify";
import { useExperimentsStore } from "@/store/experiments.store";
import i18nObject, { i18n } from "@/plugins/i18n";
import { useRoute } from "vue-router";
import { SidebarItem } from "@/types/sidebar";
import { CoreStateQuery } from "@/graphql/core/state.graphql";
import { WeatherQuery } from "@/graphql/core/weather.graphql";
import { Chat, CoreState, Upload } from "@/gql/graphql";
import { useFriendsStore } from "@/store/friends.store";
import { useMailStore } from "@/store/mail.store";

export const useAppStore = defineStore("app", {
  state: () => ({
    connected: true,
    token: localStorage.getItem("token") || "",
    _postInitRan: false,
    quickAction: parseInt(localStorage.getItem("quickAction") || "1"),
    railMode: "tpu",
    batterySave: false,
    themeProviderDefaults: {
      theme: {},
      global: {}
    },
    fluidGradient: false,
    demo: false,
    cordova: false,
    lastRoute: null,
    domain: "/i/",
    mainDrawer: true,
    workspaceDrawer: localStorage.getItem("workspaceDrawer") === "true",
    forcedWorkspaceDrawer: false,
    loading: true,
    componentLoading: false,
    apiVersion: "v4",
    title: "",
    notesSaving: false,
    themeEditor: false,
    lastNote: localStorage.getItem("lastNote")
      ? parseInt(localStorage.getItem("lastNote") as string)
      : null,
    shifting: false,
    version: {
      current: import.meta.env.TPU_VERSION || "N/A",
      date: import.meta.env.TPU_BUILD_DATE || "N/A"
    },
    site: {
      name: "TPU",
      maintenance: {
        enabled: false
      }
    } as CoreState,
    weather: {
      loading: true,
      data: {
        description: "Clouds",
        icon: "04d",
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        name: "Australia",
        id: 2643743,
        main: "Clouds"
      }
    },
    dialogs: {
      deleteItem: {
        value: false,
        item: undefined,
        emit: false
      },
      selectDefaultMobile: false,
      feedback: false,
      inviteAFriend: false,
      experiments: false,
      nickname: {
        value: false,
        userId: 0
      },
      pi: {
        value: false
      },
      gold: {
        value: false
      },
      colubrina: false,
      migrateWizard: false,
      quickSwitcher: false,
      upload: {
        value: false,
        files: [],
        percentage: 0,
        loading: false
      },
      ocr: {
        value: false,
        text: ""
      },
      memoryProfiler: false,
      socketProfiler: false,
      actionDialog: false
    },
    quickSwitcher: [
      {
        route: "/",
        name: "Home"
      },
      {
        route: "/gallery",
        name: "Gallery"
      },
      {
        route: "/collections",
        name: "Collections"
      },
      {
        route: "/insights",
        name: "Insights"
      },
      {
        route: "/settings",
        name: "Settings"
      },
      {
        route: "/autoCollects",
        name: "AutoCollects"
      },
      {
        route: "/starred",
        name: "Starred"
      },
      {
        route: "/users",
        name: "Users"
      },
      {
        route: "/workspaces",
        name: "Workspaces"
      }
    ]
  }),
  getters: {
    quickActionItem(state): SidebarItem {
      const item = this.sidebar.find((item) => item.id === state.quickAction);
      if (!item) return this.sidebar.find((item) => item.id === 1);
      return item;
    },
    sidebar(state): SidebarItem[] {
      const user = useUserStore();
      const chat = useChatStore();
      const route = useRoute();
      const experiments = useExperimentsStore();
      const app = useAppStore();

      if (!user.user) return [];
      const items = [
        {
          id: 1,
          externalPath: "",
          path: "/",
          name: i18n.t("core.sidebar.home"),
          icon: "mdi-home",
          scope: "user.view",
          exact: true
        },
        {
          id: 2,
          externalPath: "",
          path: "/settings",
          name: i18n.t("core.sidebar.settings"),
          icon: "mdi-account-cog",
          scope: "user.modify"
        },
        {
          id: 6,
          externalPath: "",
          path: "/gallery",
          exact: false,
          name: i18n.t("core.sidebar.gallery"),
          icon: "mdi-image-multiple",
          scope: "uploads.view"
        },
        {
          id: 12,
          externalPath: "",
          name: i18n.t("core.sidebar.mail"),
          path: "/mail",
          icon: "mdi-email",
          scope: "mail.view",
          experimentsRequired: ["WEBMAIL", "OFFICIAL_INSTANCE"]
        },
        {
          id: 14,
          externalPath: "",
          name: i18n.t("core.sidebar.starred"),
          path: "/starred",
          icon: "mdi-star",
          scope: ["uploads.view", "starred.view"],
          new: false
        },
        {
          id: 20,
          externalPath: "",
          path: "/users",
          name: i18n.t("core.sidebar.users"),
          icon: "mdi-account-group",
          scope: "user.view"
        },
        {
          id: 29,
          click() {
            state.dialogs.feedback = true;
          },
          externalPath: "",
          path: "",
          name: i18n.t("core.sidebar.feedback"),
          icon: "mdi-comment-question-outline",
          scope: ""
        },
        {
          id: 30,
          externalPath: "",
          path: "/changelog",
          name: i18n.t("core.sidebar.changelog"),
          icon: "mdi-history"
        },
        {
          id: 33,
          click() {
            state.dialogs.gold.value = true;
          },
          externalPath: "",
          path: "",
          name: user.gold
            ? i18n.t("core.sidebar.newWithGold")
            : i18n.t("core.sidebar.upgradeToGold"),
          icon: "mdi-plus",
          new: false,
          scope: "user.view",
          experimentsRequired: ["EARLY_ACCESS", "OFFICIAL_INSTANCE"]
        },
        {
          id: 37,
          externalPath: "",
          path: "/admin",
          name: i18n.t("core.sidebar.admin"),
          icon: "mdi-gavel",
          new: false,
          scope: "admin.view",
          experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
        },
        {
          id: 39,
          path: "/invite/privateuploader",
          name: i18n.t("core.sidebar.communicationsPublic"),
          icon: "mdi-help",
          new: true,
          scope: "",
          if:
            !chat?.chats?.find((chat) => chat.id === 375) &&
            app.site.officialInstance
        },
        {
          id: 39,
          externalPath: "https://discord.gg/4fB6GCR3Qv",
          name: i18n.t("core.sidebar.discord"),
          customIcon: "@/assets/images/discord.svg",
          new: true,
          scope: ""
        },
        {
          id: 38,
          externalPath:
            "https://play.google.com/store/apps/details?id=com.troplo.privateuploader",
          path: "",
          name: i18n.t("core.sidebar.android"),
          icon: "mdi-android",
          new: false,
          warning: "BETA",
          scope: ""
        }
      ] as SidebarItem[];

      // Server feature options
      if (
        state.site.inviteAFriend ||
        user.user?.moderator ||
        user.user?.administrator
      ) {
        items.push({
          id: 32,
          click() {
            state.dialogs.inviteAFriend = true;
          },
          externalPath: "",
          path: "",
          name: i18n.t("core.sidebar.inviteAFriend"),
          icon: "mdi-gift-outline",
          scope: ""
        });
      }

      if (state.site.features?.insights) {
        items.push({
          id: 13,
          externalPath: "",
          name: i18n.t("core.sidebar.insights"),
          path: "/insights",
          scope: "insights.view",
          icon: "mdi-chart-timeline-variant-shimmer"
        });
      }

      if (state.site.features?.communications) {
        items.push({
          id: 11,
          externalPath: "",
          name: i18n.t("core.sidebar.communications"),
          path: chat.selectedChatId
            ? `/communications/${chat.selectedChatId}`
            : "/communications",
          icon: "mdi-message-processing",
          warning: functions.checkScope("chats.view", user.user?.scopes)
            ? chat.totalUnread
            : false,
          scope: "chats.view",
          experimentsRequired: ["COMMUNICATIONS"]
        });
      }

      if (state.site.features?.workspaces) {
        items.push({
          id: 10,
          externalPath: "",
          name: i18n.t("core.sidebar.workspaces"),
          path: route.name?.toString()?.includes("Workspace")
            ? "/workspaces"
            : state.lastNote
            ? `/workspaces/notes/${state.lastNote}`
            : "/workspaces",
          icon: "mdi-folder-account",
          scope: "workspaces.view",
          experimentsRequired: ["INTERACTIVE_NOTES"]
        });
      }

      if (state.site.features?.collections) {
        items.push({
          id: 7,
          externalPath: "",
          name: i18n.t("core.sidebar.collections"),
          path: "/collections",
          icon: "mdi-folder-multiple-image",
          new: false,
          scope: "collections.view"
        });
      }

      if (state.site.features?.autoCollects) {
        items.push({
          id: 9,
          externalPath: "",
          name: i18n.t("core.sidebar.autoCollects"),
          path: "/autoCollect",
          icon: "mdi-image-auto-adjust",
          new: false,
          scope: "collections.modify",
          warning:
            user.user.pendingAutoCollects > 0
              ? user.user.pendingAutoCollects
              : false
        });
      }

      items.sort((a, b) => a.id - b.id);

      return items.filter((item) => {
        if (item.experimentsRequired) {
          for (const experiment of item.experimentsRequired) {
            if (!experiments.experiments[experiment]) {
              return false;
            }
          }
        }
        return true;
      });
    },
    rail() {
      const experiments = useExperimentsStore();
      return (
        experiments.experiments.RAIL_SIDEBAR &&
        !vuetify.display.xlAndUp.value &&
        !vuetify.display.mobile.value
      );
    },
    weatherTemp(state) {
      const temp = state.weather.data?.temp;
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
    }
  },
  actions: {
    toggleWorkspace() {
      this.workspaceDrawer = !this.workspaceDrawer;
      if (vuetify.display.mobile.value && this.workspaceDrawer) {
        this.mainDrawer = false;
      }
    },
    toggleMain() {
      this.mainDrawer = !this.mainDrawer;
      if (vuetify.display.mobile.value && this.mainDrawer) {
        this.workspaceDrawer = false;
      }
    },
    populateQuickSwitcher() {
      const value = [
        {
          route: "/",
          name: "Home"
        },
        {
          route: "/gallery",
          name: "Gallery"
        },
        {
          route: "/collections",
          name: "Collections"
        },
        {
          route: "/insights",
          name: "Insights"
        },
        {
          route: "/settings",
          name: "Settings"
        },
        {
          route: "/autoCollects",
          name: "AutoCollects"
        },
        {
          route: "/starred",
          name: "Starred"
        },
        {
          route: "/users",
          name: "Users"
        },
        {
          route: "/workspaces",
          name: "Workspaces"
        },
        {
          name: "SP Socket Profiler",
          click: () => {
            this.dialogs.socketProfiler = true;
          }
        }
      ];
      const chats = useChatStore();
      for (const chat of chats.chats) {
        value.push({
          route: `/communications/${chat.association?.id}`,
          name: chats.getChatName(chat)
        });
      }
      const collections = useCollectionsStore();
      for (const collection of collections.items) {
        value.push({
          route: `/collections/${collection.id}`,
          name: collection.name
        });
      }
      const workspaces = useWorkspacesStore();
      for (const workspace of workspaces.recentOverall) {
        value.push({
          route: `/workspaces/${workspace.id}`,
          name: workspace.name
        });
      }
      this.quickSwitcher = value;
    },
    async deleteItem(item: Upload | undefined) {
      if (!item) return;
      this.dialogs.deleteItem.item = item;
      await axios.delete("/gallery/" + item.id);
      this.dialogs.deleteItem.value = false;
      this.dialogs.deleteItem.emit = true;
    },
    async getWeather() {
      try {
        const {
          data: { weather }
        } = await this.$apollo.query({
          query: WeatherQuery
        });
        this.weather.data = weather;
        this.weather.loading = false;
      } catch {
        //
      }
    },
    loadLocalStorage() {
      const userStore = useUserStore();
      const experimentsStore = useExperimentsStore();
      const core = localStorage.getItem("coreStore");
      if (core) {
        try {
          this.site = JSON.parse(core);
          this.domain = "https://" + this.site.domain + "/i/";
          this.loading = false;
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
    },
    postInit() {
      if (this._postInitRan) return;
      this.$app.$socket.on("disconnect", () => {
        this.connected = false;
      });
      this.$app.$socket.on("connect", () => {
        this.connected = true;
      });
      useWorkspacesStore().init();
      useChatStore().init();
      const user = useUserStore();
      setInterval(() => {
        this.getWeather();
      }, 1000 * 60 * 15);
      this._postInitRan = true;
      this.populateQuickSwitcher();
      this.getWeather();
      if (
        this.user?.plan?.internalName === "GOLD" ||
        !this.site.officialInstance
      ) {
        document.body.classList.add("gold");
        user.applyTheme();
        // remove other favicons
        const links = document.getElementsByTagName("link");
        //@ts-ignore
        for (const link of links) {
          if (
            link.getAttribute("rel") !== "manifest" &&
            link.getAttribute("rel") !== "stylesheet" &&
            link.getAttribute("rel") !== "preload" &&
            link.getAttribute("rel") !== "modulepreload"
          ) {
            link.remove();
          }
        }
        // set favicon to gold
        const link =
          (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
          (document.createElement("link") as HTMLLinkElement);
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = `/api/v3/user/favicon.png?cache=${Date.now()}&username=${
          this.user.username
        }`;
        document.head.appendChild(link);
      }
      i18nObject.global.locale = this.user?.language || "en";
    },
    async init() {
      this.loadLocalStorage();
      this.loading = true;
      console.log("loading");
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
      this.site = coreState;
      const userStore = useUserStore();
      userStore.user = currentUser;
      userStore.tracked = trackedUsers;
      userStore.blocked = blockedUsers;
      if (collections) {
        useCollectionsStore().items = collections.items;
        useCollectionsStore().pager = collections.pager;
      }
      const chatStore = useChatStore();
      chatStore.emoji = userEmoji;
      chatStore.chats = chats
        .map((chat) => {
          return {
            ...chat,
            messages:
              chatStore.chats.find((c) => c.id === chat.id)?.messages || []
          };
        })
        .sort((a: Chat, b: Chat) => {
          return (
            Number(b._redisSortDate) - Number(a._redisSortDate) ||
            Number(b.id) - Number(a.id)
          );
        });
      const experimentsStore = useExperimentsStore();
      for (const experiment of experiments) {
        experimentsStore.experiments[experiment.id] = experiment.value;
      }
      useWorkspacesStore().items = workspaces;
      useFriendsStore().friends = friends;
      useMailStore().init();
      this.experimentsInherit = experimentsStore.experiments;
      this.domain = "https://" + this.site.domain + "/i/";
      this.loading = false;
      localStorage.setItem("coreStore", JSON.stringify(coreState));
      localStorage.setItem("experimentsStore", JSON.stringify(experiments));
      localStorage.setItem("userStore", JSON.stringify(currentUser));
      localStorage.setItem("chatStore", JSON.stringify(chats));
      this.postInit();
    },
    async refresh() {
      const {
        data: { coreState }
      } = await this.$apollo.query({
        query: CoreStateQuery
      });
      this.site = coreState;
      this.domain = "https://" + this.site.domain + "/i/";
      localStorage.setItem("coreStore", JSON.stringify(coreState));
    },
    async upload() {
      try {
        const toast = useToast();
        if (!this.dialogs.upload.files.length)
          toast.error("No files selected!");
        const formData = new FormData();
        for (const file of this.dialogs.upload.files) {
          formData.append("attachments", file);
        }
        this.dialogs.upload.loading = true;
        const { data } = await axios.post("/gallery/site", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (!progressEvent.total) return;
            this.dialogs.upload.percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        });
        if (this.dialogs.upload.files.length === 1) {
          functions.copy(data[0].url);
          toast.success(
            "Successfully uploaded file and copied TPU link to clipboard!"
          );
        } else {
          toast.success("Successfully uploaded files!");
        }
        this.dialogs.upload.value = false;
        this.dialogs.upload.files = [];
        this.dialogs.upload.percentage = 0;
        this.dialogs.upload.loading = false;
      } catch (e) {
        this.dialogs.upload.percentage = 0;
        this.dialogs.upload.loading = false;
        return e;
      }
    },
    reconnectSocket(token: string) {
      this.$app.$socket.auth = { token };
      this.$app.$sockets.user.auth = { token };
      this.$app.$sockets.chat.auth = { token };
      this.$app.$sockets.autoCollects.auth = { token };
      this.$app.$sockets.friends.auth = { token };
      this.$app.$sockets.gallery.auth = { token };
      this.$app.$sockets.mail.auth = { token };
      this.$app.$sockets.pulse.auth = { token };

      this.$app.$sockets.user.disconnect().connect();
      this.$app.$sockets.chat.disconnect().connect();
      this.$app.$sockets.autoCollects.disconnect().connect();
      this.$app.$sockets.friends.disconnect().connect();
      this.$app.$sockets.gallery.disconnect().connect();
      this.$app.$sockets.mail.disconnect().connect();
      this.$app.$sockets.pulse.disconnect().connect();
      this.$app.$socket.disconnect().connect();
    }
  }
});
