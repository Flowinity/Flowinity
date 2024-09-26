/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import "./styles/main.scss";
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./styles/tpu-editorjs.css";
import "floating-vue/dist/style.css";
import router from "@/router";
import i18n from "@/plugins/i18n";
//@ts-ignore
import VueMatomo from "vue-matomo";

// Boot functions
import "./boot/declarations";
import globals from "./boot/globals";
import events from "./boot/events";
import socket from "./boot/socket";
import apolloWs from "./boot/apollo.wsTransport";
import apolloHttp from "./boot/apollo.httpTransport";
import vuetify from "@/plugins/vuetify";
import { setupSockets } from "./boot/sockets";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import { useDebugStore } from "@/store/debug.store";

const isSlideshow = window.location.pathname.startsWith("/slideshow/");

const app = createApp({
  ...App,
  ...{
    watch: {
      "$route.params.chatId"(val) {
        if (!val) return;
        this.$chat.setChat(parseInt(val));
      },
      "$route.params.mailbox"(val) {
        if (!val) return;
        this.$mail.setMailbox(val);
      },
      "$app.workspaceDrawer"(val) {
        if (this.$app.forcedWorkspaceDrawer) return;
        localStorage.setItem("workspaceDrawer", val.toString());
      },
      "$app.title"(val) {
        document.title = `${val} - ${this.$app.site.name}`;
      },
      "$vuetify.display.mobile"(val) {
        this.$app.mainDrawer = !val;
      },
      "$app.fluidGradient"(val) {
        if (val) {
          document.body.classList.add("fluid-gradient");
        } else {
          document.body.classList.remove("fluid-gradient");
        }
      }
    }
  }
});

app.use(vuetify);

if (import.meta.env.VITE_PROD_ANALYTICS === "true") {
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
}

if (process.env.NODE_ENV === "development") {
  const loggingMixin = {
    beforeMount() {
      if (
        //@ts-ignore
        this.$options?.name?.startsWith("V") ||
        //@ts-ignore
        this.$options?.name === "BaseTransition"
      )
        return;
      // find where the component is defined
      //@ts-ignore
      console.log(
        `[TPU/Dev] ${this.$options.__file?.split("/")?.pop()} mounted`
      );
    },
    updated() {
      if (
        //@ts-ignore
        this.$options?.name?.startsWith("V") ||
        //@ts-ignore
        this.$options?.name === "BaseTransition"
      )
        return;
      //@ts-ignore
      console.log(
        `[TPU/Dev] ${this.$options.__file?.split("/")?.pop()} updated`
      );
      if (!this.$el?.style || !localStorage.getItem("renderMonitor")) return;
      this.$el.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      setTimeout(() => {
        this.$el.style.backgroundColor = "";
      }, 200);
      const debugStore = useDebugStore();
      console.log(this);
      if (!this.$data?._renderId) {
        this.$data._renderId = Math.random() * 1000000;
      }
      const component = debugStore.rerenders.find(
        (c) => c.id === this.$data._renderId.toString()
      );
      if (component) {
        component.renders++;
      } else {
        debugStore.rerenders.push({
          id: this.$data._renderId.toString(),
          name: this.$options.__file?.split("/")?.pop(),
          renders: 1,
          el: this.$el,
          stateA: null,
          stateB: null
        });
      }
    }
  };
  app.mixin(loggingMixin);
}

app.use(Toast, {
  shareAppContext: true
});
app.config.globalProperties.$toast = useToast();
app.use(i18n);

if (import.meta.env.DEV) app.config.performance = true;

// Register boot plugins
registerPlugins(app);
globals(app);

if (!isSlideshow) {
  apolloHttp(app);
}

if (!isSlideshow) {
  events();
  socket(app).then(() => {});
  setupSockets(app);
}

app.component("TpuSwitch", TpuSwitch);

app.mount("#tpu-app");

export default app;
