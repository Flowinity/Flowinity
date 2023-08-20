// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ExperimentsQuery } from "@/graphql/query/core/experiments.graphql";

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
      const experiments = localStorage.getItem("experimentsStore");
      if (experiments) {
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
      }
      const {
        data: { getExperiments }
      } = await this.$apollo.query({
        query: ExperimentsQuery
      });
      for (const experiment of getExperiments) {
        this.experiments[experiment.id] = experiment.value;
      }
      this.experimentsInherit = this.experiments;
      localStorage.setItem(
        "experimentsStore",
        JSON.stringify(this.experiments)
      );
    }
  }
});
