<template>
  <v-menu
    :id="id"
    :model-value="modelValue"
    :style="menuStyle"
    style="z-index: 6001 !important"
    :min-width="100"
    :eager="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div :id="id">
      <slot />
    </div>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    y: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      id: ""
    };
  },
  computed: {
    menuStyle() {
      const element = document.getElementById(this.id);
      if (!element) {
        return `
    position: absolute;
    top: ${this.y}px;
    left: ${this.x}px;
    overflow: hidden;`;
      }
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = this.x - 10;
      let top = this.y;

      // Check if the menu is too far to the right
      if (left + width > viewportWidth) {
        left = viewportWidth - width;
      }

      // Check if the menu is too far to the left
      if (left < 0) {
        left = 0;
      }

      // Check if the menu is too far to the bottom
      if (top + height > viewportHeight) {
        top = viewportHeight - height;
      }

      // Check if the menu is too far to the top
      if (top < 0) {
        top = 0;
      }

      console.log({ width, height, top });

      return `
    position: absolute;
    top: ${top}px;
    left: ${left}px;`;
    }
  },
  mounted() {
    this.genId();
  },
  methods: {
    genId() {
      this.id = `tpu-menu-${Math.random().toString(36).substring(2, 10)}`;
      return this.id;
    }
  }
});
</script>
