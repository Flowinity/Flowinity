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
import validation from "@/plugins/validation";
declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $user: ReturnType<typeof useUserStore>;
    $app: ReturnType<typeof useAppStore>;
    $experiments: ReturnType<typeof useExperimentsStore>;
    $date: typeof dayjs;
    $functions: {
      fileSize: (size: number) => string;
      copy: (text: string) => void;
    };
    $collections: ReturnType<typeof useCollectionsStore>;
    $toast: any;
    $validation: any;
    $workspaces: ReturnType<typeof useWorkspacesStore>;
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
      const workspace = useWorkspacesStore();
      app.config.globalProperties.$user = user;
      app.config.globalProperties.$app = core;
      app.config.globalProperties.$experiments = experiments;
      app.config.globalProperties.$date = dayjs;
      app.config.globalProperties.$functions = functions;
      app.config.globalProperties.$collections = collections;
      app.config.globalProperties.$validation = validation;
      app.config.globalProperties.$workspaces = workspace;
      user.init().then(() => {
        console.info("[TPU/UserStore] User initialized");
      });
      core.init().then(() => {
        console.info("[TPU/CoreStore] Core initialized");
      });
      experiments.init().then(() => {
        console.info("[TPU/ExperimentsStore] Experiments initialized");
      });
      collections.init().then(() => {
        console.info("[TPU/CollectionsStore] Collections initialized");
      });
      workspace.init().then(() => {
        console.info("[TPU/WorkspacesStore] Workspaces initialized");
      });
    }
  }
});

const options: PluginOptions = {};
import { useToast } from "vue-toastification";
import { useWorkspacesStore } from "@/store/workspaces";

app.use(VueAxios, axios);
app.use(Toast, options);
app.config.globalProperties.$toast = useToast();
registerPlugins(app);

app.mount("#app");
