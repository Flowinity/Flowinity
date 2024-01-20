/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import pinia from "../store";
// Types
import { App, markRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import router from "@/router";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(router);
  pinia.use(({ store }) => {
    store.$apollo = app.config.globalProperties.$apollo;
    store.$apolloProvider = app.config.globalProperties.$apolloProvider;
    store.$app = app.config.globalProperties;
    store.$router = markRaw(router);
  });
  app.use(pinia);
}
