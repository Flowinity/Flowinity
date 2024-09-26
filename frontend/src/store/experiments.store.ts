// Utilities
import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { computed, ref, watch } from "vue";
import { gql } from "@apollo/client";
import {
  ExperimentOverrideInput,
  Experiments,
  GetExperimentsDocument,
  SetExperimentDocument,
  GetExperimentsQuery
} from "@/gql/graphql";

export const useExperimentsStore = defineStore("experiments", () => {
  const experimentsConfig = ref<GetExperimentsQuery["experiments"]>([]);
  const experiments = computed<Record<Experiments, number>>(() => {
    return experimentsConfig.value.reduce((acc, cur) => {
      acc[cur.id] = cur.value;
      return acc;
    }, []) as unknown as Record<Experiments, number>;
  });
  const experimentsInherit = ref<Record<string, number | boolean | object>>({});

  async function setExperiment(
    key: Experiments,
    value: number,
    userId?: number
  ) {
    if (!experimentsConfig.value.find((e) => e.id === key)) {
      throw new Error("Invalid experiment key or it is not loaded.");
    }
    experimentsConfig.value.find((e) => e.id === key)!.value = value;
    await useApolloClient().client.mutate({
      mutation: SetExperimentDocument,
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

  watch(
    () => experiments.value.PRIDE,
    (value) => {
      if (value) {
        document.body.classList.add("rainbow");
      } else {
        document.body.classList.remove("rainbow");
      }
    }
  );

  async function init(version?: number) {
    let localExperiments: any = localStorage.getItem("experimentsStore");
    if (localExperiments) {
      try {
        localExperiments = JSON.parse(localExperiments);
        for (const experiment of localExperiments) {
          experiments.value[experiment.id] = experiment.value;
        }
      } catch {
        //
      }
    }
    const {
      data: { experiments: getExperiments }
    } = await useApolloClient().client.query({
      query: GetExperimentsDocument,
      variables:
        version !== undefined
          ? {
              version
            }
          : undefined,
      fetchPolicy: "network-only"
    });
    experimentsConfig.value = getExperiments;
    localStorage.setItem("experimentsStore", JSON.stringify(experiments.value));
  }

  async function getEmergencyOverrides(userId?: number) {
    const {
      data: { adminGetExperimentOverrides }
    } = await useApolloClient().client.query({
      query: gql`
        query AdminGetExperimentOverrides($userId: Int!) {
          adminGetExperimentOverrides(userId: $userId) {
            id
            value
            force
            userId
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only"
    });
    return adminGetExperimentOverrides;
  }

  async function deleteEmergencyOverride(id: string) {
    await useApolloClient().client.mutate({
      mutation: gql`
        mutation AdminDeleteExperimentOverride($id: String!) {
          adminDeleteExperimentOverride(id: $id) {
            success
          }
        }
      `,
      variables: {
        id
      }
    });
  }

  async function createEmergencyOverride(override: ExperimentOverrideInput) {
    await useApolloClient().client.mutate({
      mutation: gql`
        mutation AdminSetExperimentOverride($input: ExperimentOverrideInput!) {
          adminSetExperimentOverride(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: override
      }
    });
  }

  return {
    experiments,
    setExperiment,
    init,
    experimentsInherit,
    getEmergencyOverrides,
    deleteEmergencyOverride,
    createEmergencyOverride
  };
});
