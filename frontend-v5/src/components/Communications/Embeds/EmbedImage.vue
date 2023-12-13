<template>
  <tpu-img
    :src="
      media.attachment ? appStore.domain + media.attachment : media.proxyUrl
    "
    class="pointer rounded mb-1"
    v-for="(media, index) in embed.media?.filter(
      (m) => m.type === EmbedMediaType.Image
    )"
    :key="index"
    :height="media.height! > 400 ? 220 : media.height!"
    :style="{
      maxHeight: media.height! > 400 ? 220 + 'px' : media.height! * 2 + 'px'
    }"
    :class="{
      'mx-auto': embed.text?.length
    }"
  />
</template>

<script setup lang="ts">
import { inject, PropType } from "vue";
import { EmbedDataV2, EmbedMediaType } from "@/gql/graphql";
import { useAppStore } from "@/stores/app.store";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";

const embed = inject<EmbedDataV2>("embed")!;

const appStore = useAppStore();

const width = 700;
</script>

<style scoped></style>
