<template>
  <div class="hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        <p class="font-bold">Download Flowinity</p>
      </div>
      <div class="subtitle">
        <p class="text-2xl font-semibold">
          Get started with Flowinity on your device today.
        </p>
      </div>
      <div class="mt-4">
        <DownloadButton />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}

.hero-body {
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.hero-body .title {
  font-size: 4rem;
  font-weight: 700;
}

.mobile .title {
  font-size: 2rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
}

.mobile .subtitle {
  font-size: 1.25rem;
}
</style>
<script setup lang="ts">
import DownloadButton from "@/components/Downloads/DownloadButton.vue";
import { useAppStore } from "@/store/app.store";

const appStore = useAppStore();

appStore.title = "Downloads";
</script>
