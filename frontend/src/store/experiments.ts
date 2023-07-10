import { defineStore } from "pinia";

// Import Plugins
import axios from "@/plugins/axios";

export interface ExperimentsState {
  experiments: Record<string, string | number | boolean | object>;
  experimentsInherit: Record<string, string | number | boolean | object>;
}

export const useExperimentsStore = defineStore("experiments", {
  state: () =>
    ({
      experiments: {
        API_VERSION: 3
      },
      experimentsInherit: {}
    } as ExperimentsState),
  getters: {},
  actions: {
    async init() {
      const experiments: string = localStorage.getItem("experimentsStore");

      if (experiments)
        try {
          this.experiments = JSON.parse(experiments);
          /*if (this.experiments.API_VERSION) {
          axios.defaults.baseURL = import.meta.env.CORDOVA
            ? `https://images.flowinity.com/api/${this.experiments.API_VERSION}`
            : `/api/v${this.experiments.API_VERSION}`;
        }*/
        } catch {
          //
        }

      const { data } = await axios.get("/core/experiments");

      this.experiments = {
        ...data,
        ...JSON.parse(localStorage.getItem("experiments") || "{}")
      };

      /*if (this.experiments.API_VERSION) {
        axios.defaults.baseURL = import.meta.env.CORDOVA
          ? `https://images.flowinity.com/api/${this.experiments.API_VERSION}`
          : `/api/v${this.experiments.API_VERSION}`;
      }*/

      this.experimentsInherit = data;

      localStorage.setItem("experimentsStore", JSON.stringify(data));
    }
  }
});
