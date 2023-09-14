<template>
  <v-navigation-drawer v-bind="$attrs" :width="w" :rail="w <= 100">
    <slot />
    <div
      class="resizer"
      @mousedown="startResize"
      :class="{
        left: $attrs.location === 'left' || !$attrs.location,
        right: $attrs.location === 'right'
      }"
    ></div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CoreSidebar",
  props: {
    width: {
      type: Number,
      default: 256
    },
    name: {
      type: String,
      default: "sidebar"
    },
    canResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isResizing: false,
      startX: 0,
      w: this.width
    };
  },
  methods: {
    startResize(e) {
      e.preventDefault();
      this.isResizing = true;
      this.startX = e.clientX;
      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResize);
    },
    resize(e) {
      if (this.isResizing) {
        const newWidth = this.w + (e.clientX - this.startX);
        this.w = Math.max(100, newWidth); // Minimum width to prevent sidebar from becoming too narrow
        this.startX = e.clientX;
      }
    },
    stopResize() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResize);
    }
  },
  mounted() {
    if (this.id === "sidebar") {
      console.warn(
        "[TPU/Sidebar]: Please provide a unique id for each sidebar component."
      );
    }
    const width = localStorage.getItem(`sidebar-${this.name}`);
    if (width) {
      this.w = parseInt(width);
    }
  }
});
</script>

<style scoped>
.resizer {
  width: 10px;
  cursor: col-resize;
  position: absolute;
  top: 0;
  bottom: 0;
  margin-left: 10px;
  border-radius: 5px;
}

.left {
  right: 0;
}

.right {
  left: 0;
}
</style>
