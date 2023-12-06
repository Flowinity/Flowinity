<template>
  <div
    class="absolute items-center justify-center flex bg-sidebar-dark w-full h-full"
    style="z-index: 9999"
  >
    <div class="flex flex-col items-center">
      <flowinity-logo class="w-24" />
      <h1>{{ t("connection.title") }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style lang="scss">
:root {
  overflow: hidden;
}
</style>
