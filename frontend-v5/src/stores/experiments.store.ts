import { ref } from "vue";
import { defineStore } from "pinia";
import { ExperimentsQuery } from "@/graphql/core/experiments.graphql";

export const useExperimentsStore = defineStore("experiments", () => {
  const experiments = ref<Record<string, number>>({});
  const experimentsInherit = ref<Record<string, number>>({});

  async function init() {
    const experimentsLocal = localStorage.getItem("experimentsStore");
    if (experimentsLocal) {
      try {
        experiments.value = JSON.parse(experimentsLocal);
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
      experiments.value[experiment.id] = experiment.value;
    }
    experimentsInherit.value = this.experiments;
    localStorage.setItem("experimentsStore", JSON.stringify(this.experiments));
  }

  return {
    experiments,
    experimentsInherit,
    init
  };
});
