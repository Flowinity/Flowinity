<template>
  <WorkspaceDeleteDialog
    v-model="$app.dialogs.deleteItem.value"
    :item="$app.dialogs.deleteItem.item"
    title="Delete item?"
    @submit="$app.deleteItem($app.dialogs.deleteItem.item)"
  />
  <URLConfirmDialog
    v-model="$chat.dialogs.externalSite.value"
  ></URLConfirmDialog>
  <InviteAFriend v-model="$app.dialogs.inviteAFriend"></InviteAFriend>
  <Feedback v-model="$app.dialogs.feedback"></Feedback>
  <Migrate
    v-model="$app.dialogs.migrateWizard"
    v-if="$experiments.experiments.PROJECT_MERGE"
  ></Migrate>
  <Gold v-model="$app.dialogs.gold.value"></Gold>
  <v-app
    v-if="$user.user"
    @drop="dragDropHandler"
    @dragover="dragOver"
    @touchstart="
      $experiments.experiments.LEGACY_MOBILE_NAV ? touchStart($event) : null
    "
    @touchend="
      $experiments.experiments.LEGACY_MOBILE_NAV ? touchEnd($event) : null
    "
    class="bg"
  >
    <NicknameDialog v-model="$app.dialogs.nickname.value"></NicknameDialog>
    <QuickSwitcher v-model="$app.dialogs.quickSwitcher"></QuickSwitcher>
    <UploadDialog v-model="$app.dialogs.upload.value"></UploadDialog>
    <MemoryProfiler v-if="$app.dialogs.memoryProfiler"></MemoryProfiler>
    <ExperimentsManagerDialog
      v-if="
        $app.dialogs.experiments &&
        ($user.user?.administrator || $user.user?.moderator)
      "
    ></ExperimentsManagerDialog>
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
    <default-bar v-if="$app.site.finishedSetup" />
    <rail-bar
      v-if="
        $experiments.experiments.RAIL_SIDEBAR &&
        $app.rail &&
        $app.site.finishedSetup
      "
    ></rail-bar>
    <keep-alive v-if="$app.rail">
      <component :is="currentRailComponent"></component>
    </keep-alive>
    <sidebar
      v-if="
        !$app.rail &&
        !$vuetify.display.mobile &&
        $app.site.finishedSetup &&
        (!$vuetify.display.mobile || $experiments.experiments.LEGACY_MOBILE_NAV)
      "
    ></sidebar>
    <colubrina-sidebar
      v-if="!$app.rail && $chat.isCommunications"
    ></colubrina-sidebar>
    <workspaces-sidebar v-if="!$app.rail"></workspaces-sidebar>
    <bottom-bar
      v-if="
        $app.site.finishedSetup &&
        $vuetify.display.mobile &&
        !$experiments.experiments.LEGACY_MOBILE_NAV
      "
    />
    <theme-engine-wrapper></theme-engine-wrapper>
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
    <unauth-bar
      v-if="$route.name !== 'Slideshow' && $app.site.finishedSetup"
    ></unauth-bar>
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import UnauthBar from "@/layouts/unauth/AppBar.vue";
import URLConfirmDialog from "@/components/Communications/Dialogs/URLConfirm.vue";
import MemoryProfiler from "@/components/Dev/Dialogs/MemoryProfiler.vue";
import UploadDialog from "@/components/Core/Dialogs/Upload.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import QuickSwitcher from "@/components/Core/Dialogs/QuickSwitcher.vue";
import NicknameDialog from "@/components/Core/Dialogs/Nickname.vue";
import ThemeEngineWrapper from "@/components/Core/ThemeEngineWrapper.vue";
import RailBar from "@/layouts/default/RailBar.vue";
import ExperimentsManagerDialog from "@/components/Dev/Dialogs/Experiments.vue";
import Gold from "@/components/Dashboard/Dialogs/Gold.vue";
import InviteAFriend from "@/components/Dashboard/Dialogs/InviteAFriend.vue";
import Feedback from "@/components/Dashboard/Dialogs/Feedback.vue";
import Migrate from "@/components/Dashboard/Dialogs/Migrate.vue";
import BottomBar from "@/layouts/default/BottomBar.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
import MessageToast from "@/components/Communications/MessageToast.vue";
import { Message as MessageType } from "@/models/message";
import { Upload } from "@/models/upload";
import Sidebar from "@/layouts/default/Sidebar.vue";
import WorkspacesSidebar from "@/layouts/default/WorkspacesSidebar.vue";
import ColubrinaSidebar from "@/layouts/colubrina/Sidebar.vue";

export default defineComponent({
  name: "TPUDefaultLayout",
  components: {
    Sidebar,
    WorkspacesSidebar,
    ColubrinaSidebar
  },
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
      msgToast: MessageToast,
      touchStartX: null as number | null,
      touchEndX: null as number | null
    };
  },
  computed: {
    currentRailComponent() {
      if (this.$app.railMode === "communications") {
        return "ColubrinaSidebar";
      } else if (this.$app.railMode === "workspaces") {
        return "WorkspacesSidebar";
      } else {
        return "Sidebar";
      }
    }
  },
  methods: {
    touchEnd(event: TouchEvent) {
      if (event.target instanceof Element) {
        if (
          event.target.classList.contains("v-btn") ||
          event.target.classList.contains("v-icon") ||
          event.target.classList.contains("v-slide") ||
          event.target.classList.contains("v-navigation-drawer") ||
          event.target.classList.contains("v-btn__content") ||
          event.target.classList.contains("v-slider-thumb__ripple") ||
          event.target.classList.contains("v-slider-thumb") ||
          event.target.classList.contains("apexcharts-svg") ||
          event.target.classList.contains("v-img__gradient") ||
          event.target.classList.contains("v-img__image") ||
          event.target.classList.contains("v-card-text") ||
          event.target.classList.contains("v-card-title")
        )
          return;
      }
      if (this.$app.workspaceDrawer || this.$app.mainDrawer) return;
      this.touchEndX = event.changedTouches[0].screenX;
      if (!this.touchStartX || !this.touchEndX) return;
      if (this.touchEndX > this.touchStartX) {
        if (this.touchEndX - this.touchStartX > 130) {
          this.touchStartX = null;
          this.touchEndX = null;
          this.$app.toggleMain();
        }
      } else if (this.touchEndX < this.touchStartX) {
        if (this.touchStartX - this.touchEndX > 130) {
          this.touchStartX = null;
          this.touchEndX = null;
          this.$app.toggleWorkspace();
        }
      }
    },
    touchStart(event: TouchEvent) {
      this.touchStartX = event.changedTouches[0].screenX;
    },
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
    },
    dragDropHandler(e: DragEvent) {
      if (
        this.$route.path.startsWith("/communications/") ||
        this.$route.path.startsWith("/workspaces/")
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer?.files?.length) return;
      const files = e.dataTransfer?.files;
      if (files) {
        this.$app.dialogs.upload.files = [...files];
        this.$app.upload();
      }
    },
    dragOver(e: DragEvent) {
      if (
        this.$route.path.startsWith("/communications/") ||
        this.$route.path.startsWith("/workspaces/")
      )
        return;
      e.preventDefault();
      e.stopPropagation();
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
        e.preventDefault();
        this.$app.dialogs.memoryProfiler = !this.$app.dialogs.memoryProfiler;
      } else if ((e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) {
        e.preventDefault();
        this.$app.dialogs.quickSwitcher = !this.$app.dialogs.quickSwitcher;
      } else if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        this.$app.dialogs.experiments = !this.$app.dialogs.experiments;
      }
      if (
        (e.ctrlKey && e.altKey && e.key === "d") ||
        (e.metaKey && e.altKey && e.key === "d")
      ) {
        e.preventDefault();
        console.log("Revert CSS");
        this.$user.applyCSS(true);
      }
      if (e.ctrlKey && e.altKey && e.key === "e") {
        this.$app.themeEditor = !this.$app.themeEditor;
      }
    });
    this.getPulseSession();
    this.getPulseSessionGlobal();
  },
  watch: {
    $route(to, from) {
      if (!this.$user.gold) {
        const goldElements = document.getElementsByClassName("gold");
        while (goldElements.length > 0) {
          goldElements[0].classList.remove("gold");
        }
      }
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
