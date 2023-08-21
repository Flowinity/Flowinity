// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useToast } from "vue-toastification";
import functions from "@/plugins/functions";
import { AxiosProgressEvent } from "axios";
import { useUserStore } from "@/store/user";
import { Upload } from "@/models/upload";
import { useChatStore } from "@/store/chat";
import { useCollectionsStore } from "@/store/collections";
import { useWorkspacesStore } from "@/store/workspaces";
import vuetify from "@/plugins/vuetify";
import { useExperimentsStore } from "@/store/experiments";
import { i18n } from "@/plugins/i18n";
import { useRoute } from "vue-router";
import { SidebarItem } from "@/types/sidebar";
import { Announcement } from "@/models/announcement";
import { CoreStateQuery } from "@/graphql/query/core/state.graphql";
import { WeatherQuery } from "@/graphql/query/core/weather.graphql";

export interface AppState {
  quickAction: number;
  railMode: "tpu" | "workspaces" | "communications";
  fluidGradient: boolean;
  cordova: boolean;
  domain: string;
  mainDrawer: boolean;
  workspaceDrawer: boolean;
  forcedWorkspaceDrawer: boolean;
  loading: boolean;
  componentLoading: boolean;
  apiVersion: string;
  title: string;
  notesSaving: boolean;
  lastNote: number | null;
  lastRoute: string | null;
  shifting: boolean;
  themeEditor: boolean;
  site: {
    redisHost?: string;
    dbHost?: string;
    preTrustedDomains: string[];
    hostnames?: string[];
    domain?: string;
    step?: number;
    finishedSetup: boolean;
    registrations: boolean;
    name: string;
    release: string;
    route: string | null;
    loading: boolean;
    matomoId: string | null;
    hostname: string;
    hostnameWithProtocol: string;
    announcements: Announcement[];
    flowinityId: string;
    officialInstance: boolean;
    connection: {
      ip: string;
      whitelist:
        | {
            ip: string;
            name: string;
            groups: string[];
          }
        | false;
    };
    stats: {
      collections: number;
      collectionItems: number;
      pulse: number;
      users: number;
      uploads: number;
      usage: number;
      pulses: number;
      docs: number;
      invites: number;
      messages: number;
      chats: number;
      crashes: number;
      messageGraph: {
        labels: string[];
        data: number[];
      } | null;
      pulseGraph: {
        labels: string[];
        data: number[];
      } | null;
      uploadGraph: {
        labels: string[];
        data: number[];
      } | null;
    };
    maintenance: {
      enabled: boolean;
      message: string;
      statusPage: string;
    };
    alert: string;
    _redis: string;
    server: string;
    inviteAFriend: boolean;
    features: {
      communications: boolean;
      collections: boolean;
      autoCollects: boolean;
      workspaces: boolean;
      insights: boolean;
    };
    termsNoteId?: string;
    privacyNoteId?: string;
  };
  dialogs: {
    deleteItem: {
      value: boolean;
      item: Upload | undefined;
      emit: boolean;
    };
    selectDefaultMobile: boolean;
    inviteAFriend: boolean;
    feedback: boolean;
    experiments: boolean;
    migrateWizard: boolean;
    quickSwitcher: boolean;
    memoryProfiler: boolean;
    colubrina: boolean;
    nickname: {
      value: boolean;
      userId: number;
    };
    upload: {
      value: boolean;
      percentage: number;
      files: File[];
      loading: boolean;
    };
    gold: {
      value: boolean;
    };
    pi: {
      value: boolean;
    };
    ocr: {
      value: boolean;
      text: string;
    };
  };
  weather: {
    loading: boolean;
    data: {
      description: string;
      icon: string;
      temp: number;
      temp_max: number;
      temp_min: number;
      name: string;
      id: number;
      main: string;
    };
  };
  version: {
    current: string;
    date: string;
  };
  quickSwitcher: {
    route: string;
    name: string;
  }[];
  demo: boolean;
  themeProviderDefaults: any;
  batterySave: boolean;
}

export const useAppStore = defineStore("app", {
  state: () =>
    ({
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
      domain: import.meta.env.DEV ? "/i/" : "https://i.troplo.com/i/",
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
        preTrustedDomains: [],
        hostnames: [],
        termsNoteId: "",
        privacyNoteId: "",
        finishedSetup: true,
        alert: "",
        registrations: false,
        name: "TPU",
        release: "prod",
        route: null,
        loading: false,
        matomoId: null,
        hostname: "https://images.flowinity.com",
        hostnameWithProtocol: "https://images.flowinity.com",
        announcements: [],
        flowinityId: "troplo-private-uploader",
        stats: {
          uploadGraph: null,
          messageGraph: null,
          pulseGraph: null,
          collections: 0,
          collectionItems: 0,
          pulse: 0,
          users: 0,
          uploads: 0,
          usage: 0,
          pulses: 0,
          docs: 0,
          invites: 0,
          messages: 0,
          chats: 0,
          crashes: 0
        },
        maintenance: {
          enabled: false,
          message: "",
          statusPage: ""
        },
        _redis: new Date().toISOString(),
        server: "MAIN4",
        officialInstance: true,
        features: {
          communications: true,
          collections: true,
          autoCollects: true,
          workspaces: true,
          insights: true
        },
        inviteAFriend: true,
        connection: {
          ip: "",
          whitelist: false
        }
      },
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
        memoryProfiler: false
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
    } as AppState),
  getters: {
    quickActionItem(state: AppState): SidebarItem {
      const item = this.sidebar.find((item) => item.id === state.quickAction);
      if (!item) return this.sidebar.find((item) => item.id === 1);
      return item;
    },
    sidebar(state: AppState): SidebarItem[] {
      const user = useUserStore();
      const chat = useChatStore();
      const route = useRoute();
      const experiments = useExperimentsStore();

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
          scope: "gallery.view"
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
          scope: ["gallery.view", "starred.view"],
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
          scope: "*"
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
          id: 39,
          click() {
            state.dialogs.migrateWizard = true;
          },
          externalPath: "",
          path: "",
          name: i18n.t("core.sidebar.colubrinaMigrate"),
          icon: "mdi-chart-gantt",
          new: false,
          scope: "user.view",
          experimentsRequired: ["PROJECT_MERGE", "OFFICIAL_INSTANCE"]
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
          id: 38,
          externalPath:
            "https://play.google.com/store/apps/details?id=com.troplo.privateuploader",
          path: "",
          name: i18n.t("core.sidebar.android"),
          icon: "mdi-android",
          new: false,
          warning: "BETA",
          scope: "*"
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
          new: true,
          scope: "*"
        });
      }

      if (state.site.features?.insights) {
        items.push({
          id: 13,
          externalPath: "",
          name: i18n.t("core.sidebar.insights"),
          path: "/insights",
          scope: "*",
          icon: "mdi-chart-timeline-variant-shimmer",
          new: true
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
            ? chat.totalUnread || "BETA"
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
          new: true,
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
    weatherTemp(state: AppState) {
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
    async init() {
      this.loading = true;
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
      const {
        data: { coreState }
      } = await this.$apollo.query({
        query: CoreStateQuery
      });
      this.site = coreState;
      this.domain = "https://" + this.site.domain + "/i/";
      localStorage.setItem("coreStore", JSON.stringify(coreState));
      this.loading = false;
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
    }
  }
});
