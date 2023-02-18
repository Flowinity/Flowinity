// Utilities
import { defineStore } from "pinia";
import vuetify from "@/plugins/vuetify";
import axios from "@/plugins/axios";

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
    _redis: string;
  };
}

export const useAppStore = defineStore("app", {
  state: () =>
    ({
      domain: "https://i.troplo.com/i/",
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
      site: {
        registrations: false,
        name: "TPUvNEXT",
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
