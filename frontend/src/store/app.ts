// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useToast } from "vue-toastification";
import functions from "@/plugins/functions";
import { AxiosProgressEvent } from "axios";
import { useUserStore } from "@/store/user";

export interface AppState {
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
  forcedMainDrawer: boolean;
  shifting: boolean;
  site: {
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
      uploadGraph: {
        labels: string[];
        data: number[];
      } | null;
    };
    maintenance: boolean;
    alert: string;
    _redis: string;
  };
  dialogs: {
    memoryProfiler: boolean;
    upload: {
      value: boolean;
      percentage: number;
      files: File[];
      loading: boolean;
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
}

export const useAppStore = defineStore("app", {
  state: () =>
    ({
      domain: import.meta.env.DEV ? "/i/" : "https://i.troplo.com/i/",
      mainDrawer: true,
      workspaceDrawer: localStorage.getItem("workspaceDrawer") === "true",
      forcedWorkspaceDrawer: false,
      loading: true,
      componentLoading: false,
      apiVersion: "v2",
      title: "",
      notesSaving: false,
      forcedMainDrawer: false,
      lastNote: localStorage.getItem("lastNote")
        ? parseInt(localStorage.getItem("lastNote") as string)
        : null,
      shifting: false,
      version: {
        current: import.meta.env.TPU_VERSION || "N/A",
        date: import.meta.env.TPU_BUILD_DATE || "N/A"
      },
      site: {
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
          collections: 0,
          collectionItems: 0,
          pulse: 0,
          users: 0,
          uploads: 0,
          usage: 0,
          pulses: 0,
          docs: 0,
          invites: 0
        },
        maintenance: false,
        _redis: new Date().toISOString()
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
        upload: {
          value: false,
          files: [],
          percentage: 0,
          loading: false
        },
        memoryProfiler: false
      }
    } as AppState),
  getters: {
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
    async getWeather() {
      try {
        const { data } = await axios.get("/core/weather");
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
          this.loading = false;
        } catch {
          //
        }
      }
      const { data } = await axios.get("/core");
      this.site = data;
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
