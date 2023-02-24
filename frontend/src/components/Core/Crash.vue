<template>
  <div class="crash-parent">
    <div class="crashed">
      <v-icon class="margin" size="96">mdi-skull</v-icon>
      <div class="margin title">TPU has crashed.</div>
      <div class="margin crashed subtitle">Please refresh the page.</div>
      <div class="margin crashed debug" v-if="e?.error?.message">
        {{ e?.error?.message }}
      </div>
      <div class="margin crashed debug" v-else>
        Please check the JavaScript console for more information.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Crash",
  props: ["e"]
});
</script>

<style scoped>
.margin {
  margin-top: 0.25rem;
}
.crashed {
  background: #181818;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  position: relative;
  z-index: 696969;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-top: -0.25rem;
  margin-bottom: 1rem;
}

.crash-parent {
  width: 100%;
  height: 100%;
  background-color: #181818;
  position: absolute;
  z-index: 696969;
  overflow-y: hidden;
}

@media (max-width: 600px) {
  .sidebar-offset {
    margin-left: 0;
  }
}
</style>
