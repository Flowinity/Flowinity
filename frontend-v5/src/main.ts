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
import socket from "./boot/socket";
import apollo from "./boot/apollo";
import { registerPlugins } from "@/plugins";
import VWave from "v-wave";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

const app = createApp(App);

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
app.use(Toast, {});

// Register boot plugins
apollo(app);
registerPlugins(app);
globals(app);
events();
socket(app).then(() => {});

app.use(VueApolloComponents);

app.mount("#app");
