import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import {
  PulseMutation,
  UpdatePulseMutation
} from "@/graphql/pulse/pulse.graphql";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.store";

export const usePulseStore = defineStore("pulse", () => {
  const pulse = ref({
    id: "",
    timeOnPage: 0,
    timeOnPageGlobal: 0,
    lastCreated: 0,
    interval: undefined as number | undefined
  });

  const route = useRoute();

  const userStore = useUserStore();

  async function getPulseSessionGlobal() {
    if (userStore.user?.pulse === false) return;

    const {
      data: { createPulse }
    } = await useApolloClient().client.mutate({
      mutation: PulseMutation,
      variables: {
        input: {
          type: "global",
          action: "focus",
          route: route.path,
          device: navigator.platform,
          sysInfo: {
            ua: navigator.userAgent
          },
          name: null,
          other: {
            type: "page"
          }
        }
      }
    });

    if (!createPulse) return;

    setInterval(() => {
      if (document.hasFocus()) {
        pulse.value.timeOnPageGlobal += 5000;
        useApolloClient().client.mutate({
          mutation: UpdatePulseMutation,
          variables: {
            input: {
              id: createPulse,
              timeSpent: pulse.value.timeOnPageGlobal
            }
          }
        });
      }
    }, 5000);
  }

  async function getPulseSession() {
    if (userStore.user?.pulse === false) return;

    const cachedRoute = route.path;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (cachedRoute !== route.path) return;

    pulse.value.lastCreated = Date.now();
    if (pulse.value.interval !== undefined) clearInterval(pulse.value.interval);
    pulse.value.timeOnPage = 0;
    const {
      data: { createPulse }
    } = await useApolloClient().client.mutate({
      mutation: PulseMutation,
      variables: {
        input: {
          type: "global",
          action: "focus",
          route: route.path,
          device: navigator.platform,
          sysInfo: {
            ua: navigator.userAgent
          },
          name: null,
          other: {
            type: "page"
          }
        }
      }
    });

    if (!createPulse) return;

    pulse.value.id = createPulse;
    pulse.value.interval = setInterval(() => {
      if (document.hasFocus()) {
        pulse.value.timeOnPage += 5000;
        useApolloClient().client.mutate({
          mutation: UpdatePulseMutation,
          variables: {
            input: {
              id: pulse.value.id,
              timeSpent: pulse.value.timeOnPage
            }
          }
        });
      }
    }, 5000);
  }

  return {
    pulse,
    getPulseSessionGlobal,
    getPulseSession
  };
});
