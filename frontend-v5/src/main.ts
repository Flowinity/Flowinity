import "./assets/index.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

// Boot functions
import "./boot/declarations";
import globals from "./boot/globals";
import events from "./boot/events";
import socket from "./boot/socket";
import apollo from "./boot/apollo";
import { registerPlugins } from "@/plugins";
import VWave from "v-wave";

const app = createApp(App);

app.use(VWave, {
  easing: "ease-out",
  cancellationPeriod: 30
});
app.use(router);

// Register boot plugins
registerPlugins(app);
apollo(app);
globals(app);
events();
socket(app).then(() => {});

app.mount("#app");
