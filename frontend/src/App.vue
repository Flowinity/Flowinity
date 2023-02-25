<template>
  <VErrorBoundary
    :fall-back="skullCrash"
    @error-captured="submitFeedback"
    :params="{ e: error }"
    stop-propagation
  >
    <router-view />
  </VErrorBoundary>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Crash from "@/components/Core/Crash.vue";
import VErrorBoundary from "./components/Core/ErrorBoundary.vue";
export default defineComponent({
  name: "TPUApp",
  components: { Crash, VErrorBoundary },
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
      await this.axios.post("/user/feedback", {
        route: this.$route.path,
        starRating: 0,
        text: `{"name":"[TPU/SkullCrash]","msg":${e?.error?.message},"stack":${e?.error?.stack}}`
      });
    }
  },
  mounted() {
    if (this.$vuetify.display.mobile) {
      this.$app.mainDrawer = false;
      this.$chat.memberSidebarShown = false;
    }
  }
});
</script>
