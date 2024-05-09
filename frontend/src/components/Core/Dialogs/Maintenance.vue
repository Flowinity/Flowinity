<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="true"
    :persistent="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="crash-parent">
      <div class="crashed">
        <FlowinityBannerHandler
          style="max-width: 500px; max-height: 80px; margin-left: 0 !important"
          class="mb-2"
        />
        <div class="title">Maintenance...</div>
        <div class="crashed subtitle">
          {{ $app.site.maintenance.message }}
        </div>
        <v-btn
          color="primary"
          class="mt-n2"
          :href="$app.site.maintenance.statusPage"
          target="_blank"
        >
          Learn more
        </v-btn>
        <v-card-subtitle
          v-if="checking"
          style="position: fixed; left: 50%; transform: translateX(-50%)"
        >
          Checking status...
        </v-card-subtitle>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlowinityBannerHandler from "@/components/Brand/FlowinityBannerHandler.vue";

export default defineComponent({
  components: { FlowinityBannerHandler },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      checking: false
    };
  },
  mounted() {
    setInterval(this.check, 5000);
  },
  beforeUnmount() {
    clearInterval(this.check);
  },
  methods: {
    async check() {
      if (this.checking) return;
      this.checking = true;
      await this.$app.refresh();
      this.checking = false;
      return this.checking;
    }
  }
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
