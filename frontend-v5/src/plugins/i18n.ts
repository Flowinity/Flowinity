import { createI18n } from "vue-i18n";

import enUS from "@/locales/en-US.json";
import ruRU from "@/locales/ru-RU.json";

const instance = createI18n({
  legacy: true,
  fallbackLocale: "en",
  messages: {
    "en": enUS,
    "ru-RU": ruRU,
  }
});

export default instance;

export const i18n = instance.global;
