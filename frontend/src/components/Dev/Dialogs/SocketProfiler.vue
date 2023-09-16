<template>
  <DevDialog @close="$app.dialogs.socketProfiler = false">
    <template v-slot:header>Socket Profiler (QS -> SP)</template>
    <v-container>
      Refreshes every second.
      <div v-for="item in sockets" :key="item.name">
        <strong>{{ item.name }}:</strong>
        <span :style="{ color: item.connected ? '#0190ea' : '#e12929' }">
          &nbsp;
          {{ item.connected ? "Connected" : "Disconnected" }}
        </span>
      </div>
      Ensure the scoped password/API has permissions for socket.
    </v-container>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { useChatStore } from "@/store/chat";
import { useExperimentsStore } from "@/store/experiments";
import { useFriendsStore } from "@/store/friends";
import { useCollectionsStore } from "@/store/collections";
import { useWorkspacesStore } from "@/store/workspaces";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";

export default defineComponent({
  name: "SocketProfiler",
  components: { DevDialog },
  data() {
    return {
      sockets: [] as {
        name: string;
        connected: boolean;
      }[],
      interval: null
    };
  },
  methods: {
    socketConnections() {
      this.sockets = [
        {
          name: "Chat",
          connected: this.$sockets.chat.connected
        },
        {
          name: "User",
          connected: this.$sockets.user.connected
        },
        {
          name: "Friends",
          connected: this.$sockets.friends.connected
        },
        {
          name: "Mail",
          connected: this.$sockets.mail.connected
        },
        {
          name: "Pulse",
          connected: this.$sockets.pulse.connected
        },
        {
          name: "Gallery",
          connected: this.$sockets.gallery.connected
        },
        {
          name: "AutoCollects",
          connected: this.$sockets.autoCollects.connected
        },
        {
          name: "Tracked Users (Status/Presence)",
          connected: this.$sockets.trackedUsers.connected
        },
        {
          name: "TPU",
          connected: this.$socket.connected
        }
      ];
    }
  },
  mounted() {
    this.socketConnections();
    this.interval = setInterval(this.socketConnections, 1000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
});
</script>
