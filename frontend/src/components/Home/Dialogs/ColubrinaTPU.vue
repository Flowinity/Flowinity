<template>
  <v-dialog
    @update:model-value="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="600px"
  >
    <v-card color="#151515">
      <v-img src="https://i.troplo.com/i/69d36e5ebdea.png" class="mx-4"></v-img>
      <v-card-title class="text-center justify-center">
        Colubrina is now TPU.
      </v-card-title>
      <v-card-subtitle class="text-center justify-center">
        Experience the new Colubrina with all the other advantages of TPU.
      </v-card-subtitle>
      <v-card-actions class="text-center justify-center">
        <v-btn
          color="primary"
          text
          class="no-capital mr-8"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Learn More
        </v-btn>
        <v-btn color="primary" class="no-capital" to="/register">
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
