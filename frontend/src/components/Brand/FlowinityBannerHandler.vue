<template>
  <FlowinityBanner
    v-if="
      $experiments.experiments.FLOWINITY &&
      !$experiments.experiments.PRIDE &&
      $app.site.officialInstance
    "
    id="tpu-brand-logo"
    style="
      min-height: 48px;
      min-width: 150px;
      max-height: 48px;
      max-width: 150px;
    "
    class="ml-4 unselectable pointer"
    src="@/assets/images/flowinity-logo-banner.svg"
    @click="$router.push('/')"
  />
  <FlowinityBannerRainbow
    v-else-if="
      $experiments.experiments.FLOWINITY &&
      $experiments.experiments.PRIDE &&
      $app.site.officialInstance
    "
    id="tpu-brand-logo"
    style="
      min-height: 48px;
      min-width: 150px;
      max-height: 48px;
      max-width: 150px;
    "
    class="ml-4 unselectable pointer"
    src="@/assets/images/flowinity-logo-banner.svg"
    @click="$router.push('/')"
  />
  <h1
    v-else
    id="tpu-brand-logo"
    class="text-gradient unselectable ml-4 pointer"
    style="z-index: 10; cursor: pointer; font-size: 32px"
    title="PrivateUploader"
    @click="$router.push('/')"
  >
    {{ $app.site.name }}
  </h1>
</template>

<script setup lang="ts">
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";
import FlowinityBannerRainbow from "@/components/Brand/FlowinityBannerRainbow.vue";
</script>

<style scoped></style>
