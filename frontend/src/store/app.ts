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

export interface AppState {
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
    announcements: any[];
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
    maintenance: boolean;
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
      apiVersion: "v3",
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
        maintenance: false,
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
        inviteAFriend: true
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
      let value = [
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
        const { data } = await axios.get("/core/weather", {
          headers: {
            noToast: true
          }
        });
        this.weather.data = data;
        this.weather.loading = false;
      } catch {}
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
      const { data } = await axios.get("/core");
      this.site = data;
      this.domain = "https://" + this.site.domain + "/i/";
      localStorage.setItem("coreStore", JSON.stringify(data));
      this.loading = false;
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
