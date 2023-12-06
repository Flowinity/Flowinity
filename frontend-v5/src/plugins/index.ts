/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import pinia from "../stores";
// Types
import type { App } from "vue";
import { useRouter } from "vue-router";
import { createI18n } from "vue-i18n";
import en from "@/locales/en-US.json";

export function registerPlugins(app: App) {
  loadFonts();
  pinia.use(({ store }) => {
    store.$apollo = app.config.globalProperties.$apollo;
    store.$apolloProvider = app.config.globalProperties.$apolloProvider;
    store.$app = app.config.globalProperties;
  });
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages: {
      en
    }
  });
  app.use(i18n);
  app.use(pinia);
}
