/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import pinia from "../store";
import router from "../router";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  pinia.use(({ store }) => {
    store.$apollo = app.config.globalProperties.$apollo;
    store.$apolloProvider = app.config.globalProperties.$apolloProvider;
    store.$globalProperties = app.config.globalProperties;
  });
  app.use(pinia).use(router);
}
