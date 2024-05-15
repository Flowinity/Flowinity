<template>
  <DevDialog @close="$app.dialogs.experiments = false">
    <template #header>Experiments Manager (CTRL + Q)</template>
    <v-container style="background: black">
      <v-card>
        <v-card-title>Modify experiment values</v-card-title>
        <v-card-text>
          <ExperimentsManager />
        </v-card-text>
      </v-card>
    </v-container>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ExperimentsManager from "@/components/Dev/ExperimentsManager.vue";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";

export default defineComponent({
  name: "ExperimentsManagerDialog",
  components: { DevDialog, ExperimentsManager }
});
</script>
