import { App } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import apolloFlowinity from "@/boot/apollo.httpTransport";
import apolloTroploServices from "@/boot/apollo.troploservices";
import { provideApolloClients } from "@vue/apollo-composable";
import { useAppStore } from "@/store/app.store";
import { useRouter } from "vue-router";

export default async function setup(app: App) {
  const flowinity = apolloFlowinity(app);
  const troploservices = apolloTroploServices(app);
  const apolloProvider = createApolloProvider({
    defaultClient: flowinity,
    clients: {
      troploservices
    }
  });

  const appStore = useAppStore();
  appStore.connected = true;
  app.config.globalProperties.$apollo = flowinity;

  provideApolloClients({
    default: flowinity,
    troploservices
  });

  const router = useRouter();

  appStore.init().then(() => {
    if (!appStore.site.finishedSetup) {
      router.push("/setup");
    }
    console.info("[TPU/CoreStore] Core initialized");
  });
}
