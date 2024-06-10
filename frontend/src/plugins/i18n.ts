import { createI18n } from "vue-i18n";

// Import locales
import en from "@/locales/en-US.json";
import enGB from "@/locales/en-GB.json";
import ru from "@/locales/ru.json";
import fr from "@/locales/fr.json";

const instance = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    "en-GB": enGB,
    ru,
    fr
  }
});

export default instance;

export const i18n = instance.global;
