<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card color="#151515">
      <v-img class="mx-4" src="https://i.troplo.com/i/69d36e5ebdea.png"></v-img>
      <v-card-title class="text-center justify-center">
        Colubrina is now TPU.
      </v-card-title>
      <v-card-subtitle class="text-center justify-center">
        Experience the new Colubrina with all the other advantages of TPU.
      </v-card-subtitle>
      <v-card-actions class="text-center justify-center">
        <v-btn
          class="no-capital mr-8"
          color="primary"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Learn More
        </v-btn>
        <v-btn class="no-capital" color="primary" to="/register">
          <v-icon class="mr-1">mdi-arrow-right</v-icon>
          Register now
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ColubrinaTPU",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"]
});
</script>

<style scoped></style>
