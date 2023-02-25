<template>
  <v-app v-if="$user.user">
    <UploadDialog v-model="$app.dialogs.upload.value"></UploadDialog>
    <MemoryProfiler v-if="$app.dialogs.memoryProfiler"></MemoryProfiler>
    <URLConfirmDialog
      v-model="$chat.dialogs.externalSite.value"
    ></URLConfirmDialog>
    <v-overlay
      persistent
      absolute
      :model-value="$app.loading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      persistent
      :model-value="$app.componentLoading"
      class="align-center justify-center"
      absolute
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <default-bar />
    <sidebar></sidebar>
    <workspaces-sidebar
      v-if="
        $chat.communicationsSidebar ||
        $chat.selectedChat?.type !== 'group' ||
        !$chat.isCommunications
      "
    ></workspaces-sidebar>
    <default-view />
    <template v-if="$experiments.experiments.FAB">
      <v-btn
        variant="flat"
        icon
        position="sticky"
        class="fab"
        color="primary"
        style="color: #151515 !important"
        @click="fab = !fab"
      >
        <v-icon>{{ fab ? "mdi-close" : "mdi-plus" }}</v-icon>
      </v-btn>
      <v-fab-transition>
        <v-btn
          v-if="fab"
          variant="flat"
          icon
          position="sticky"
          class="fab-2"
          color="indigo"
          @click="fab = !fab"
        >
          <v-icon>mdi-upload</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-fab-transition>
        <v-btn
          v-if="fab"
          variant="flat"
          icon
          position="absolute"
          class="fab-3"
          color="success"
          @click="fab = !fab"
        >
          <v-icon>mdi-file-document-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
  </v-app>
  <v-app v-else>
    <v-overlay :model-value="$app.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay
      :model-value="$app.componentLoading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <unauth-bar v-if="$route.name !== 'Slideshow'"></unauth-bar>
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import Sidebar from "@/layouts/default/Sidebar.vue";
import UnauthBar from "@/layouts/unauth/AppBar.vue";
import WorkspacesSidebar from "@/layouts/default/WorkspacesSidebar.vue";
import URLConfirmDialog from "@/components/Communications/Dialogs/URLConfirm.vue";
import MemoryProfiler from "@/components/Dev/Dialogs/MemoryProfiler.vue";
import UploadDialog from "@/components/Core/Dialogs/Upload.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
import MessageToast from "@/components/Communications/MessageToast.vue";
import { Message as MessageType } from "@/models/message";

export default defineComponent({
  name: "TPUDefaultLayout",
  data() {
    return {
      fab: false,
      pulse: {
        timeOnPage: 0,
        timeOnPageGlobal: 0,
        interval: undefined as ReturnType<typeof setInterval> | undefined,
        id: "",
        lastCreated: undefined as number | undefined
      },
      msgToast: MessageToast
    };
  },
  methods: {
    getPulseSessionGlobal() {
      const id = Math.random().toString(36).substring(7);
      this.$socket.emit("startPulse", {
        type: "global",
        id,
        action: "focus",
        route: this.$route.path,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          type: "session"
        }
      });
      this.$socket.on("pulseToken-" + id, (res: any) => {
        setInterval(() => {
          if (document.hasFocus()) {
            this.pulse.timeOnPageGlobal += 5000;
            this.$socket.emit("updatePulse", {
              id: res.id,
              timeOnPage: this.pulse.timeOnPageGlobal
            });
          }
        }, 5000);
      });
    },
    getPulseSession() {
      this.pulse.timeOnPage = 0;
      if (
        this.pulse.lastCreated &&
        this.pulse.lastCreated > Date.now() - 1000
      ) {
        return;
      }
      this.pulse.lastCreated = Date.now();
      clearInterval(this.pulse.interval);
      this.pulse.timeOnPage = 0;
      const id = Math.random().toString(36).substring(7);
      this.$socket.emit("startPulse", {
        type: "global",
        id,
        action: "focus",
        route: this.$route.path,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          type: "page"
        }
      });
      this.$socket.on("pulseToken-" + id, (res: any) => {
        this.pulse.id = res.id;
        this.pulse.interval = setInterval(() => {
          if (document.hasFocus()) {
            this.pulse.timeOnPage += 5000;
            this.$socket.emit("updatePulse", {
              id: res.id,
              timeOnPage: this.pulse.timeOnPage
            });
          }
        }, 5000);
      });
    }
  },
  mounted() {
    if (window.location.pathname.startsWith("/slideshow/")) {
      this.$app.componentLoading = false;
      this.$app.loading = false;
      return;
    }
    // watch for CTRL + ALT + M for Memory Profiler
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "m") {
        this.$app.dialogs.memoryProfiler = !this.$app.dialogs.memoryProfiler;
      }
    });
    this.getPulseSession();
    this.getPulseSessionGlobal();
  },
  watch: {
    $route(to, from) {
      this.getPulseSession();
      this.$socket.emit("pulse", {
        action: "page-change",
        route: to.path,
        timeSpent: 0,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          lastRoute: from.path
        }
      });
    }
  }
});
</script>

<style scoped>
.fab {
  bottom: 16px;
  right: 16px;
  z-index: 6969;
}
.fab-2 {
  bottom: 76px;
  right: 16px;
  z-index: 6969;
}
.fab-3 {
  bottom: 136px;
  right: 16px;
  z-index: 6969;
}
.fab-4 {
  bottom: 196px;
  right: 16px;
  z-index: 6969;
}
</style>
