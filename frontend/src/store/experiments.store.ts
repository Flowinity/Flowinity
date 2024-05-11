// Utilities
import { defineStore } from "pinia";
import {
  ExperimentsQuery,
  SetExperimentMutation
} from "@/graphql/core/experiments.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { ref, watch } from "vue";

export interface ExperimentsState {
  experiments: Record<string, string | number | boolean | object>;
  experimentsInherit: Record<string, string | number | boolean | object>;
}

export const useExperimentsStore = defineStore("experiments", () => {
  const experiments = ref<Record<string, number | boolean | object>>({
    API_VERSION: 3,
    FLOWINITY: 1,
    DISABLE_ANIMATIONS: 0
  });
  const experimentsInherit = ref<Record<string, number | boolean | object>>({});

  async function setExperiment(key: string, value: number, userId?: number) {
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
  }

  watch(
    () => experiments.value.DISABLE_ANIMATIONS,
    (value) => {
      if (value) {
        document.body.classList.add("disable-animations");
      } else {
        document.body.classList.remove("disable-animations");
      }
    }
  );

  async function init() {
    const localExperiments = localStorage.getItem("experimentsStore");
    if (localExperiments) {
      try {
        this.experiments = JSON.parse(localExperiments);
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
      experiments.value[experiment.id] = experiment.value;
      if (!experiments.value["meta"]) experiments.value.meta = {};
      experiments.value["meta"][experiment.id] = experiment;
    }
    experimentsInherit.value = experiments.value;
    localStorage.setItem("experimentsStore", JSON.stringify(experiments.value));
  }

  return {
    experiments,
    setExperiment,
    init,
    experimentsInherit
  };
});
