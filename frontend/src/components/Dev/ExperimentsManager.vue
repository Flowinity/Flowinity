<template>
  <v-card v-for="experiment in experiments" class="my-2">
    <v-card-title>{{ experiment.name }}</v-card-title>
    <v-card-subtitle>{{ experiment.meta?.description }}</v-card-subtitle>
    <v-card-subtitle>
      {{ $date(experiment.meta?.createdAt).format("YYYY-MM-DD") }}
    </v-card-subtitle>
    <v-card-text v-if="experiment.type === 'boolean'">
      <v-radio-group v-model="$experiments.experiments[experiment.name]">
        <v-radio label="Inherit" :value="experiment.inheritValue"></v-radio>
        <v-radio label="Enabled" :value="true"></v-radio>
        <v-radio label="Disabled" :value="false"></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-text v-else-if="experiment.type === 'number'">
      <v-text-field
        :model-value="$experiments.experiments[experiment.name]"
        @update:model-value="
          $experiments.experiments[experiment.name] = parseInt($event || '0')
        "
        type="number"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ExperimentsManager",
  props: ["username"],
  data() {
    return {
      retain: false
    };
  },
  computed: {
    experiments() {
      return Object.entries(this.$experiments.experiments)
        .map(([name, value]) => ({
          name,
          value,
          inheritValue: this.$experiments.experimentsInherit[name],
          type: typeof value,
          meta: this.$experiments.experimentsInherit.meta[name]
        }))
        .filter((experiment) => experiment.name !== "meta");
    }
  }
});
</script>

<style scoped></style>
