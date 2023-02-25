<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Dev</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-btn @click="crash">Crash SPA</v-btn>
        <v-btn @click="acceptFriends">Accept all friend requests</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dev",
  methods: {
    crash() {
      throw new Error("Crash");
    },
    async acceptFriends() {
      await this.axios.patch("/admin/dev/friendAccept");
      this.$toast.success("OK");
    }
  }
});
</script>

<style scoped></style>
