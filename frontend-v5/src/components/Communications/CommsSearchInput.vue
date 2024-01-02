<template>
  <text-field
    style="
      border-bottom: none;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 14px;
      height: 30px;
    "
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :placeholder="placeholder || $t('chats.search')"
    parent-classes="bg-comms-search-dark pl-2 rounded"
    :persistent-placeholder="true"
  ></text-field>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";

defineProps({
  placeholder: String,
  modelValue: String
});

defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
