<template>
  <DevDialog @close="$app.dialogs.actionDialog = false">
    <template v-slot:header>Action Activator</template>
    <v-container>
      <p class="mb-3">You found the secret menu! (CTRL + ALT + M)</p>
      <v-btn
        v-for="dialog in Object.keys($app.dialogs).filter(
          (key) => typeof $app.dialogs[key] === 'boolean'
        )"
        :key="dialog"
        @click="$app.dialogs[dialog] = !$app.dialogs[dialog]"
      >
        {{ dialog }}
      </v-btn>

      <v-btn
        v-for="dialog in Object.keys($app.dialogs).filter(
          (key) => typeof $app.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$app.dialogs[dialog].value = !$app.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
      <v-btn
        v-for="dialog in Object.keys($chat.dialogs).filter(
          (key) => typeof $chat.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$chat.dialogs[dialog].value = !$chat.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
      <v-btn
        v-for="dialog in Object.keys($user.dialogs).filter(
          (key) => typeof $user.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$user.dialogs[dialog].value = !$user.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
    </v-container>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";

export default defineComponent({
  name: "ActionDialog",
  components: { DevDialog },
  data() {
    return {
      usage: []
    };
  },
  computed: {
    socketConnections() {
      return [
        {
          name: "Chat",
          connected: this.$sockets.chat.connected,
          readyState: this.$sockets.chat.readyState
        }
      ];
    }
  }
});
</script>
