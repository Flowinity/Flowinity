<template>
  <div class="crash-parent">
    <div class="crashed">
      <v-icon class="margin" size="96">mdi-skull</v-icon>
      <div class="margin title">
        {{ name || "TPU child component" }} has crashed.
      </div>
      <div class="margin crashed subtitle">Please refresh the page.</div>
      <div v-if="e?.error?.message" class="margin crashed debug">
        {{ e.error.message }}
      </div>
      <div v-else class="margin crashed debug">
        Please check the JavaScript console for more information.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CrashComponent",
  props: ["e", "name"]
});
</script>

<style scoped>
.margin {
  margin-top: 0.25rem;
}

.crashed {
  background: var(--v-theme-background);
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 696969;
}

.title {
  font-size: 2rem;
  font-weight: 700;
}

.crash-parent {
  background: var(--v-theme-background);
  position: relative;
  z-index: 696969;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  .sidebar-offset {
    margin-left: 0;
  }
}
</style>
