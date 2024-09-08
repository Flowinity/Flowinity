// Utilities
import { defineStore } from "pinia";
import {
  ExperimentsQuery,
  SetExperimentMutation
} from "@/graphql/core/experiments.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { ref, watch } from "vue";
import { gql } from "@apollo/client";
import { ExperimentOverrideInput, Experiments } from "@/gql/graphql";

export const useExperimentsStore = defineStore("experiments", () => {
  const experiments = ref<Record<Experiments, number>>({
    ACCOUNT_DEV_ELIGIBLE: 0,
    ANDROID_CONFIG: 0,
    API_FALLBACK_ON_ERROR: 0,
    API_VERSION_V2: 0,
    BADGES: 0,
    BREADCRUMB_SHOW_PARENT: 0,
    CAN_ENABLE_PROGRESSIVE_UI: 0,
    CHAT_CACHING: 0,
    CHAT_GUIDED_WIZARD: 0,
    CLASSIC_MIGRATE: 0,
    COMMS_SUPERBAR: 0,
    COMMUNICATIONS: 0,
    COMMUNICATIONS_INLINE_SIDEBAR_HIRES: 0,
    COMMUNICATIONS_KEEP_LOADED: 0,
    COMMUNICATIONS_QUAD_SIDEBAR_LOWRES: 0,
    COPY_MSG_ID: 0,
    CREEPY_SFX_BUTTON: 0,
    DEBUG_FAVICON: 0,
    DESIGN_V2: 0,
    DOWNLOAD_THE_APP_NAG: 0,
    EARLY_ACCESS: 0,
    EDITOR_V2: 0,
    ENABLE_AUTOSTART_APP_NAG: 0,
    ENABLE_PULSE_TAB: 0,
    EXPAND_APP_BAR_IMAGE: 0,
    EXPERIENCE_FLUID: 0,
    EXPERIENCE_GALLERY_ITEM_WIDTH: 0,
    EXPERIENCE_ITEMS_PER_PAGE: 0,
    FAB: 0,
    GALLERY_INFINITE_SCROLL: 0,
    HOVER_CHIP_CLOSE_DELAY: 0,
    HOVER_CHIP_HOVER: 0,
    HOVER_CHIP_OPEN_DELAY: 0,
    IAF_NAG: 0,
    INSTANT_UPLOAD: 0,
    INTERACTIVE_NOTES: 0,
    LEGACY_ATTRIBUTES_UI: 0,
    LEGACY_CUSTOMIZATION: 0,
    LEGACY_FLOWINITY_SSO: 0,
    LEGACY_MOBILE_NAV: 0,
    MEET: 0,
    MEME_GEN: 0,
    NATIVE_BADGES: 0,
    NEW_BRANDING: 0,
    NOTE_AI_ASSIST: 0,
    NOTE_COLLAB: 0,
    NOTIFICATION_SOUND: 0,
    OFFICIAL_INSTANCE: 0,
    PINNED_MESSAGES: 0,
    PRIDE: 0,
    PROFILE_BANNER: 0,
    PROGRESSIVE_HOME: 0,
    PROGRESSIVE_UI: 0,
    PROJECT_CENTRAL: 0,
    PROJECT_MERGE: 0,
    QUICK_NOTES: 0,
    RAIL_SIDEBAR: 0,
    REMOVE_LEGACY_SOCKET: 0,
    RESIZABLE_SIDEBARS: 0,
    SFX_KFX: 0,
    SFX_KOLF: 0,
    SURVEYS: 0,
    THEME: 0,
    USER_V2: 0,
    USER_V3: 0,
    USER_V3_EDITOR: 0,
    USER_V3_MODIFY: 0,
    V5_FLOAT: 0,
    WEATHER: 0,
    WEBMAIL: 0,
    WIDGETS: 0,
    WORKSPACES_SIDEBAR: 0,
    meta: 0,
    API_VERSION: 3,
    FLOWINITY: 1,
    DISABLE_ANIMATIONS: 0
  });
  console.log(experiments.value.PROGRESSIVE_UI);
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
      query: ExperimentsQuery,
      variables:
        version !== undefined
          ? {
              version
            }
          : undefined,
      fetchPolicy: "network-only"
    });
    for (const experiment of getExperiments) {
      console.log(`Loaded: ${experiment.id}`);
      experiments.value[experiment.id] = experiment.value;
      if (!experiments.value["meta"]) experiments.value.meta = {};
      experiments.value["meta"][experiment.id] = experiment;
    }
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
