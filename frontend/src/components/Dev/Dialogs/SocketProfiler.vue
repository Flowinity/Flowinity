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
          <v-btn color="white" @click="item.disconnect">Kill</v-btn>
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
        connect: () => {};
        disconnect: () => {};
      }[],
      interval: null
    };
  },
  methods: {
    socketConnections() {
      this.sockets = [
        {
          name: "Chat",
          connected: this.$sockets.chat.connected,
          disconnect: this.$sockets.chat.disconnect,
          connect: this.$sockets.chat.connect
        },
        {
          name: "User",
          connected: this.$sockets.user.connected,
          disconnect: this.$sockets.user.disconnect,
          connect: this.$sockets.user.connect
        },
        {
          name: "Friends",
          connected: this.$sockets.friends.connected,
          disconnect: this.$sockets.friends.disconnect,
          connect: this.$sockets.friends.connect
        },
        {
          name: "Mail",
          connected: this.$sockets.mail.connected,
          disconnect: this.$sockets.mail.disconnect,
          connect: this.$sockets.mail.connect
        },
        {
          name: "Pulse",
          connected: this.$sockets.pulse.connected,
          disconnect: this.$sockets.pulse.disconnect,
          connect: this.$sockets.pulse.connect
        },
        {
          name: "Gallery",
          connected: this.$sockets.gallery.connected,
          disconnect: this.$sockets.gallery.disconnect,
          connect: this.$sockets.gallery.connect
        },
        {
          name: "AutoCollects",
          connected: this.$sockets.autoCollects.connected,
          disconnect: this.$sockets.autoCollects.disconnect,
          connect: this.$sockets.autoCollects.connect
        },
        {
          name: "Tracked Users (Status/Presence)",
          connected: this.$sockets.trackedUsers.connected,
          disconnect: this.$sockets.trackedUsers.disconnect,
          connect: this.$sockets.trackedUsers.connect
        },
        {
          name: "TPU",
          connected: this.$socket.connected,
          disconnect: this.$socket.disconnect,
          connect: this.$socket.connect
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
