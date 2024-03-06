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
import { Platform } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";

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

    if (this.$app.platform !== Platform.WEB) {
      console.log("Electron detected");
      window.electron.ipcRenderer.on(IpcChannels.OPEN_SETTINGS, () => {
        this.$router.push("/settings/desktop");
      });
      window.electron.ipcRenderer.on(IpcChannels.OPEN_ABOUT, () => {
        this.$router.push("/settings/about");
      });
      window.electron.ipcRenderer.on(IpcChannels.UPDATE_DOWNLOADED, () => {
        this.$app.desktop.updateAvailable = true;
      });
      window.electron.ipcRenderer.on(IpcChannels.FOCUS_CHAT, (_, data) => {
        this.$router.push(`/communications/${data}`);
        window.electron.ipcRenderer.send(IpcChannels.FOCUS_WINDOW);
      });
      window.electron.ipcRenderer
        .invoke("get-version")
        .then((version: string) => {
          this.$app.desktop.version = version;
        });

      if (this.$app.platform === Platform.LINUX) {
        this.$app.checkForUpdates();
        setInterval(() => {
          this.$app.checkForUpdates();
        }, 60000);
      }
    }
  }
});
</script>
