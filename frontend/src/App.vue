<template>
  <Maintenance
    v-model="$app.site.maintenance.enabled"
    v-if="$app.site.maintenance.enabled"
  ></Maintenance>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Crash from "@/components/Core/Crash.vue";
import VErrorBoundary from "./components/Core/ErrorBoundary.vue";
import Maintenance from "@/components/Core/Dialogs/Maintenance.vue";

export default defineComponent({
  name: "TPUApp",
  components: { Maintenance, Crash, VErrorBoundary },
  data() {
    return {
      skullCrash: Crash,
      error: null
    };
  },
  methods: {
    async submitFeedback(e: any) {
      this.error = e;
      console.log("[TPU/SkullCrash] Error captured:", e);
      console.error(e.error);
      /*return;
      await this.axios.post("/user/feedback", {
        route: this.$route.path,
        starRating: 0,
        text: `{"name":"[TPU/SkullCrash]","msg":${e?.error?.message},"stack":${e?.error?.stack}}`
      });*/
    }
  },
  mounted() {
    if (this.$vuetify.display.mobile) {
      this.$app.mainDrawer = false;
      this.$chat.memberSidebarShown = false;
    }
    if (window._cordovaNative) {
      this.$app.cordova = true;
    }
    document.addEventListener(
      "backbutton",
      (e) => {
        if (this.$app.mainDrawer) {
          this.$app.mainDrawer = false;
          window.history.back();
          return;
        }
        e.preventDefault();
        this.$app.mainDrawer = true;
      },
      false
    );
  },
  watch: {
    "$route.path"(val) {
      this.$app.lastRoute = val;
    }
  }
});
</script>
