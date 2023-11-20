/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import pinia from "../store";
// Types
import type { App } from "vue";
import { useRouter } from "vue-router";
import router from "@/router";

export function registerPlugins(app: App) {
  loadFonts();
  pinia.use(({ store }) => {
    store.$apollo = app.config.globalProperties.$apollo;
    store.$apolloProvider = app.config.globalProperties.$apolloProvider;
    store.$app = app.config.globalProperties;
    store.$router = useRouter();
  });
  app.use(router).use(pinia);
}
