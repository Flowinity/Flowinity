// Utilities
import { defineStore } from "pinia";
import vuetify from "@/plugins/vuetify";
import axios from "@/plugins/axios";

export interface AppState {
  domain: string;
  mainDrawer: boolean;
  workspaceDrawer: boolean;
  loading: boolean;
  componentLoading: boolean;
  apiVersion: string;
  site: {
    name: string;
    release: string;
    route: string | null;
    loading: boolean;
    matomoId: string | null;
    hostname: string;
    hostnameWithProtocol: string;
    announcements: any[];
    flowinityId: string;
    stats: Record<string, number>;
    maintenance: boolean;
    _redis: string;
  };
}

export const useAppStore = defineStore("app", {
  state: () =>
    ({
      domain: "https://i.troplo.com/i/",
      mainDrawer: true,
      workspaceDrawer: false,
      loading: true,
      componentLoading: false,
      apiVersion: "v2",
      site: {
        name: "TPUvNEXT",
        release: "prod",
        route: null,
        loading: false,
        matomoId: null,
        hostname: "https://images.flowinity.com",
        hostnameWithProtocol: "https://images.flowinity.com",
        announcements: [],
        flowinityId: "troplo-private-uploader",
        stats: {},
        maintenance: false,
        _redis: new Date().toISOString()
      }
    } as AppState),
  getters: {},
  actions: {
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
    }
  }
});
