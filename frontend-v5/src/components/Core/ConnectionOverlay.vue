<template>
  <div
    class="absolute items-center justify-center flex bg-sidebar-dark w-full h-full"
    style="z-index: 9999"
    v-if="!appStore.connected"
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
import { onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app.store";

const { t } = useI18n();
const appStore = useAppStore();

watch(
  () => appStore.connected,
  (value) => {
    if (value) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.classList.add("blocked-scroll");
    }
  }
);

onMounted(() => {
  if (!appStore.connected) document.body.classList.add("blocked-scroll");
});
</script>
