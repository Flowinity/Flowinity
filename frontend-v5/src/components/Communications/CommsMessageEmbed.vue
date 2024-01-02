<template>
  <component
    :is="embed.text?.length ? Card : 'div'"
    :class="{
      'p-3 gap-2 flex flex-col': embed.text?.length
    }"
    :style="{
      maxWidth: width <= 500 ? width + 'px' : 500 + 'px',
      maxHeight: width <= 500 ? width + 'px' : 500 + 'px'
    }"
  >
    <embed-text />
    <embed-image />
    <embed-external-media-player />
  </component>
</template>

<script setup lang="ts">
import { PropType, provide } from "vue";
import EmbedImage from "@/components/Communications/Embeds/EmbedImage.vue";
import { EmbedDataV2 } from "@/gql/graphql";
import Card from "@/components/Framework/Card/Card.vue";
import EmbedText from "@/components/Communications/Embeds/EmbedText.vue";
import EmbedExternalMediaPlayer from "@/components/Communications/Embeds/EmbedExternalMediaPlayer.vue";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";

const props = defineProps({
  embed: {
    type: Object as PropType<EmbedDataV2>,
    required: true
  }
});

provide("embed", props.embed);

const width = 700;
</script>
