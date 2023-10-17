<template>
  <div class="gap-4 p-4 flex w-full">
    <text-field
      label="Search..."
      class="flex-grow"
      :model-value="props.search"
      @update:model-value="$emit('update:search', $event)"
      @keydown.enter="$emit('refresh')"
    ></text-field>
    <tpu-select />
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/Core/Input/TextField.vue";
import TpuSelect from "@/components/Core/Input/TpuSelect.vue";

const props = defineProps({
  search: {
    type: String
  }
});

const emits = defineEmits(["update:search", "refresh"]);
</script>

<style scoped></style>
