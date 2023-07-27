<template>
  <v-dialog
    @update:model-value="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    :fullscreen="true"
    :persistent="true"
  >
    <div class="crash-parent">
      <div class="crashed">
        <p class="text-center text-gradient mb-n2" style="font-size: 64px">
          TPU
        </p>
        <div class="title">Maintenance...</div>
        <div class="crashed subtitle">
          {{ $app.site.maintenance.message }}
        </div>
        <v-btn
          color="primary"
          class="mt-n2"
          :href="$app.site.maintenance.statusPage"
        >
          Learn more
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "Maintenance",
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"]
});
</script>

<style scoped>
.margin {
  margin-top: 0.25rem;
}

.crashed {
  background: var(--v-theme-background);
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
  background: black;
  position: absolute;
  z-index: 696969;
  overflow-y: hidden;
}

.subtitle {
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .sidebar-offset {
    margin-left: 0;
  }
}
</style>
