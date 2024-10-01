import { defineStore } from "pinia";
import { computed, ref } from "vue";

type Endpoint = {
  url: string;
  priority: number;
  region: string;
};

type Endpoints = {
  gql: Endpoint[];
  gateway: Endpoint[];
  api: Endpoint[];
};

export const useEndpointsStore = defineStore("endpoints", () => {
  const endpoints = ref<Endpoints | null>(null);
  const ready = ref(false);
  const selected = computed(() => {
    return {
      gql: endpoints.value.gql.sort((a, b) => a.priority - b.priority)[0],
      gateway: endpoints.value.gateway.sort(
        (a, b) => a.priority - b.priority
      )[0],
      api: endpoints.value.api.sort((a, b) => a.priority - b.priority)[0]
    };
  });

  async function fetchEndpoints() {
    try {
      console.log(
        `[Flowinity/Endpoints] Fetching endpoints from ${
          import.meta.env.FLOWINITY_ENDPOINTS
        }`
      );
      endpoints.value = await fetch(import.meta.env.FLOWINITY_ENDPOINTS).then(
        (res) => res.json()
      );
      console.log("[Flowinity/Endpoints] Endpoints fetched.");
      ready.value = true;
    } catch (e) {
      window.flowinityNetworkOffline(
        "Failed to fetch endpoint manifest. Check network configuration."
      );
      console.error("[Flowinity/Endpoints] Failed to fetch endpoints.", e);
      throw e;
    }
  }

  return {
    endpoints,
    ready,
    fetchEndpoints,
    selected
  };
});
