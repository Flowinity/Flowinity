import {createI18n} from "vue-i18n"

// Import locales
import enUS from "@/locales/en-US.json"
import enGB from "@/locales/en-GB.json"
import ru from "@/locales/ru.json"

export default createI18n({
  legacy: true,
  locale: "enUS",
  fallbackLocale: "enUS",
  messages: {
    enUS,
    enGB,
    ru
  }
})
