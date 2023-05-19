<template>
  <v-container>
    <v-card v-if="dashboard">
      <v-toolbar>
        <v-toolbar-title>Dashboard</v-toolbar-title>
      </v-toolbar>
      <v-container>
        More options here are coming soon. You can modify tpu.json in
        app/config/tpu.json or /var/lib/tpu_server/config/tpu.json (Docker
        environments) to make manual changes to the TPU environment, and press
        the Restart button below to restart the TPU cluster.
        <br />
        <v-btn class="mx-3 my-3" variant="outlined" @click="restart">
          <v-icon>mdi-restart</v-icon>
          Restart TPU Cluster
        </v-btn>
      </v-container>
    </v-card>
    <v-card v-else>
      <v-card-title>
        For management please use TPU Classic until the admin panel is added.
      </v-card-title>
      <v-btn class="mx-3 my-3" variant="outlined" @click="restart">
        <v-icon>mdi-restart</v-icon>
        Restart TPU Cluster
      </v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      dashboard: null
    };
  },
  methods: {
    async restart() {
      await this.axios.post("/admin/restart");
      this.$toast.success("Service restart queued.");
    },
    async getDashboard() {
      const { data } = await this.axios.get("/admin/dashboard");
      this.dashboard = data;
    }
  },
  mounted() {
    this.getDashboard();
  }
});
</script>

<style scoped></style>
