<template>
  <div
    class="video-container"
    v-for="(media, index) in embed.media?.filter((m) => m.videoEmbedUrl)"
    :key="index"
  >
    <iframe :src="media.videoEmbedUrl!">
      <p>Your browser does not support iframes.</p>
    </iframe>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { EmbedDataV2 } from "@/gql/graphql";

const embed = inject<EmbedDataV2>("embed")!;
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
