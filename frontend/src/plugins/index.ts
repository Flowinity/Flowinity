/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import pinia from "../store";
// Types
import { App, markRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import router from "@/router";

export function registerPlugins(app: App) {
  app.use(router);
  pinia.use(({ store }) => {
    store.$apollo = app.config.globalProperties.$apollo;
    store.$apolloProvider = app.config.globalProperties.$apolloProvider;
    store.$app = app.config.globalProperties;
    store.$router = markRaw(router);
    store.$route = app.config.globalProperties.$route;
  });
  app.use(pinia);
}
