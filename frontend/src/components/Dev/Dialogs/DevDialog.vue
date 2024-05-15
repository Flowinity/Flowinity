<template>
  <div :id="`dev-overlay-${id}`" class="dev-overlay">
    <div :id="`dev-header-${id}`" class="dev-header unselectable">
      <slot name="header"></slot>
      <v-btn size="small" class="float-right" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DevDialog",
  emits: ["close"],
  data() {
    return {
      id: `tpu-dev-${Math.random().toString(36).substring(2, 10)}`
    };
  },
  mounted() {
    this.drag(document.getElementById(`dev-overlay-${this.id}`));
  },
  methods: {
    drag(element: any) {
      try {
        let pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        if (document.getElementById(`dev-header-${this.id}`)) {
          document.getElementById(`dev-header-${this.id}`).onmousedown =
            dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: any) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e: any) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          element.style.top = element.offsetTop - pos2 + "px";
          element.style.left = element.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }
      } catch (e) {
        console.log(e);
        this.$toast.error("Error while initializing dev overlay");
      }
    }
  }
});
</script>
