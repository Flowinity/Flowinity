<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <GoldContent
      @update:model-value="$emit('update:modelValue', $event)"
      class="text-center"
      color="#151515"
    />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GoldContent from "@/components/Dashboard/Dialogs/GoldContent.vue";

export default defineComponent({
  components: { GoldContent },
  props: ["modelValue"],
  emits: ["update:modelValue"],

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (!val) this.step = 1;
      }
    }
  }
});
</script>
