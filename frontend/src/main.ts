/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "floating-vue/dist/style.css";
//@ts-ignore
import VueMatomo from "vue-matomo";

// Import Router
import router from "@/router";

// Import Components
import App from "./App.vue";

// Import Composables
import { createApp } from "vue";

// Import Plugins
import { registerPlugins } from "@/plugins";
import i18n from "@/plugins/i18n";

// Import Styles
import "./styles/main.scss";
import "./styles/tpu-editorjs.css";

// Import Boot functions
import "./boot/declarations";
import globals from "./boot/globals";
import events from "./boot/events";
import socket from "./boot/socket";

const app = createApp({
  ...App,
  ...{
    watch: {
      "$route.params.chatId"(val): void {
        if (!val) return;

        this.$chat.setChat(parseInt(val));
      },
      "$route.params.mailbox"(val): void {
        if (!val) return;

        this.$mail.setMailbox(val);
      },
      "$app.workspaceDrawer"(val): void {
        if (this.$app.forcedWorkspaceDrawer) return;

        localStorage.setItem("workspaceDrawer", val.toString());
      },
      "$app.title"(val): void {
        document.title = val + " - PrivateUploader";
      },
      "$vuetify.display.mobile"(val): void {
        this.$app.mainDrawer = !val;
      },
      "$app.fluidGradient"(val): void {
        if (val) document.body.classList.add("fluid-gradient");
        else document.body.classList.remove("fluid-gradient");
      }
    }
  }
});

app.use(VueMatomo, {
  host: "https://analytics.flowinity.com",
  siteId: 3,
  trackerFileName: "matomo",
  router: router,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  disableCookies: false,
  requireCookieConsent: false,
  enableHeartBeatTimer: false,
  heartBeatTimerInterval: 15,
  debug: false,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: [],
  trackSiteSearch: false,
  crossOrigin: undefined
});

if (process.env.NODE_ENV === "development") {
  const loggingMixin: {
    beforeMount: () => void;
  } = {
    beforeMount(): void {
      if (
        //@ts-ignore
        this.$options?.name?.startsWith("V") ||
        //@ts-ignore
        this.$options?.name === "BaseTransition"
      )
        return;

      // Find where the component is defined.
      //@ts-ignore
      console.log(`[PRIVATEUPLOADER/DEV] ${this.$options.name} mounted.`);
    }
  };

  app.mixin(loggingMixin);
}

app.config.globalProperties.$toast = useToast();

app.use(Toast, {
  shareAppContext: true
});
app.use(i18n);

registerPlugins(app);

if (import.meta.env.DEV) app.config.performance = true;

// Register boot plugins.
globals(app);
events();
socket(app).then((): void => {
  //
});

app.mount("#tpu-app");
