<template>
  <v-navigation-drawer v-bind="$attrs" :width="trueWidth" :rail="w <= 100">
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name || 'default'" />
      <div
        v-if="resizable"
        class="resizer"
        :class="{
          left: $attrs.location === 'left' || !$attrs.location,
          right: $attrs.location === 'right'
        }"
        @mousedown="startResize"
      ></div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
      w: this.width,
      resizable: this.canResize
    };
  },
  computed: {
    trueWidth() {
      if (this.resizable) {
        return this.w;
      } else {
        return this.width;
      }
    }
  },
  mounted() {
    this.resizable =
      this.canResize && this.$experiments.experiments["RESIZABLE_SIDEBARS"];
    if (this.id === "sidebar") {
      console.warn(
        "[TPU/Sidebar]: Please provide a unique id for each sidebar component."
      );
    }
    const width = localStorage.getItem(`sidebar-${this.name}`);
    if (width) {
      this.w = parseInt(width);
    }
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
