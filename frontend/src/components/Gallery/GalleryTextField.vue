<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="$t('generic.search')"
    append-inner-icon="mdi-close"
    class="rounded-xl"
    @click:append-inner="
      $emit('update:modelValue', '');
      $emit('refreshGallery');
    "
    v-on:keyup.enter="
      $emit('update:modelValue', modelValue);
      $emit('refreshGallery');
    "
  ></v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GalleryTextField",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue", "refreshGallery"]
});
</script>

<style scoped></style>
