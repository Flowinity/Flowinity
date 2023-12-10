import "./assets/index.css";
import "./assets/transitions.scss";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import VueApolloComponents from "@vue/apollo-components";

// Boot functions
import "./boot/declarations";
import globals from "./boot/globals";
import events from "./boot/events";
import apollo from "./boot/apollo";
import { registerPlugins } from "@/plugins";
import VWave from "v-wave";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

const app = createApp(App);
//@ts-ignore
import VueSimpleContextMenu from "vue-simple-context-menu";
import { setupSockets } from "@/boot/sockets";

app.component("VueSimpleContextMenu", VueSimpleContextMenu);

app.config.performance = true;

app.use(FloatingVue, {
  arrowPadding: 10,
  distance: 7,
  container: "#main-area",
  boundary: "#main-area",
  themes: {
    tooltip: {
      delay: {
        show: 50,
        hide: 50
      }
    }
  }
});
app.use(VWave, {
  easing: "ease-out",
  cancellationPeriod: 30
});
app.use(router);
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  shareAppContext: true,
  maxToasts: 5,
  newestOnTop: true
});

// Register boot plugins
registerPlugins(app);
apollo(app);
globals(app);
events();
setupSockets();
app.use(VueApolloComponents);

app.mount("#flowinity-app");
