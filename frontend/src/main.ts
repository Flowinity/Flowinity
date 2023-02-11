/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import VueAxios from "vue-axios";
import axios from "@/plugins/axios";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { useExperimentsStore } from "@/store/experiments";
import "./styles/main.scss";
import dayjs from "@/plugins/dayjs";
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections";
declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $user: ReturnType<typeof useUserStore>;
    $app: ReturnType<typeof useAppStore>;
    $experiments: ReturnType<typeof useExperimentsStore>;
    $date: typeof dayjs;
    $functions: {
      fileSize: (size: number) => string;
    };
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: any;
  }
}

const app = createApp({
  ...App,
  ...{
    setup() {
      const user = useUserStore();
      const core = useAppStore();
      const experiments = useExperimentsStore();
      const collections = useCollectionsStore();
      app.config.globalProperties.$user = user;
      app.config.globalProperties.$app = core;
      app.config.globalProperties.$experiments = experiments;
      app.config.globalProperties.$date = dayjs;
      app.config.globalProperties.$functions = functions;
      app.config.globalProperties.$collections = collections;
      user.init();
      core.init();
      experiments.init();
      collections.init();
    }
  }
});

const options: PluginOptions = {};
import { useToast } from "vue-toastification";

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
registerPlugins(app);

app.mount("#app");
