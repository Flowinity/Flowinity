<template>
  <SocketProfiler v-if="$app.dialogs.socketProfiler" />
  <ActionDialog v-if="$app.dialogs.actionDialog" />
  <ExperimentsManagerDialog
    v-if="
      $app.dialogs.experiments &&
      ($user.user?.administrator || $user.user?.moderator)
    "
  />
  <Maintenance
    v-if="$app.site.maintenance.enabled"
    v-model="$app.site.maintenance.enabled"
  />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Maintenance from "@/components/Core/Dialogs/Maintenance.vue";
import SocketProfiler from "@/components/Dev/Dialogs/SocketProfiler.vue";
import ActionDialog from "@/components/Dev/Dialogs/ActionDialog.vue";
import ExperimentsManagerDialog from "@/components/Dev/Dialogs/Experiments.vue";

export default defineComponent({
  name: "TPUApp",
  components: {
    ExperimentsManagerDialog,
    ActionDialog,
    SocketProfiler,
    Maintenance
  },
  watch: {
    "$route.path"(val) {
      this.$app.lastRoute = val;
    }
  },
  mounted() {
    window._tpu_router = this.$router;
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
  }
});
</script>
