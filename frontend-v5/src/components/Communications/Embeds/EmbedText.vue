<template>
  <div v-for="(text, index) in embed.text" :key="index">
    <p v-if="index === 0 && embed.metadata.siteName" class="text-sm">
      {{ embed.metadata.siteName }}
    </p>
    <p
      :class="{
        'text-medium-emphasis': !text.heading,
        'text-2xl font-bold': text.heading
      }"
    >
      {{ text.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType } from "vue";
import { EmbedDataV2 } from "@/gql/graphql";
import { useAppStore } from "@/stores/app.store";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";

const embed = inject<EmbedDataV2>("embed")!;

const appStore = useAppStore();

const width = 700;
</script>

<style scoped></style>
