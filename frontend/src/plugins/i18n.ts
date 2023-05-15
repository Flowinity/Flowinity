import { createI18n } from "vue-i18n";

// Import locales
import en from "@/locales/en-US.json";
import enGB from "@/locales/en-GB.json";
import ru from "@/locales/ru.json";

export default createI18n({
  legacy: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    enGB,
    ru
  }
});
