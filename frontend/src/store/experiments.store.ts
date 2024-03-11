// Utilities
import { defineStore } from "pinia";
import {
  ExperimentsQuery,
  SetExperimentMutation
} from "@/graphql/core/experiments.graphql";
import { useApolloClient } from "@vue/apollo-composable";

export interface ExperimentsState {
  experiments: Record<string, string | number | boolean | object>;
  experimentsInherit: Record<string, string | number | boolean | object>;
}

export const useExperimentsStore = defineStore("experiments", {
  state: () =>
    ({
      experiments: {
        API_VERSION: 3
      } as Record<string, number>,
      experimentsInherit: {} as Record<string, number>
    }) as ExperimentsState,
  getters: {},
  actions: {
    async setExperiment(key: string, value: number, userId?: number) {
      this.experiments[key] = value;
      await useApolloClient().client.mutate({
        mutation: SetExperimentMutation,
        variables: {
          input: {
            key,
            value,
            userId
          }
        }
      });
    },
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
      } = await useApolloClient().client.query({
        query: ExperimentsQuery
      });
      for (const experiment of getExperiments) {
        this.experiments[experiment.id] = experiment.value;
        if (!this.experiments["meta"]) this.experiments["meta"] = {};
        this.experiments["meta"][experiment.id] = experiment;
      }
      this.experimentsInherit = this.experiments;
      localStorage.setItem(
        "experimentsStore",
        JSON.stringify(this.experiments)
      );
    }
  }
});
