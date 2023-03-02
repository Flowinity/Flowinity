<template>
  <v-container>
    <DynamicCard
      image="https://i.troplo.com/i/0460cb1b27d3.png"
      style="cursor: default"
      height="250px"
    >
      <v-card-text style="position: absolute; top: 0; left: 0; font-size: 18px">
        The Dynamic Report shows your entire TPU history.
      </v-card-text>
    </DynamicCard>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DynamicCard from "@/components/Core/DynamicCard.vue";

export default defineComponent({
  name: "Dynamic",
  components: { DynamicCard }
});
</script>

<style scoped></style>
