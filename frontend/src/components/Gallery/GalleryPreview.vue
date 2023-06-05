<template>
  <div>
    <v-hover v-if="item.type === 'image'" v-slot="{ isHovering, props }">
      <v-img
        :src="$app.domain + item.attachment"
        contain
        height="220"
        v-bind="props"
      >
        <template v-slot:placeholder>
          <v-row align="center" class="fill-height ma-0" justify="center">
            <v-progress-circular
              color="grey lighten-5"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
        <a :href="$app.domain + item.attachment" target="_blank">
          <v-overlay
            v-if="isHovering"
            :model-value="true"
            class="align-center justify-center"
            contained
          >
            <v-icon color="white" large size="40">mdi-open-in-new</v-icon>
          </v-overlay>
        </a>
      </v-img>
    </v-hover>
    <video
      v-else-if="item.type === 'video'"
      controls
      height="220"
      style="width: 100%"
    >
      <source :src="$app.domain + item.attachment" type="video/mp4" />
    </video>
    <audio v-else-if="item.type === 'audio'" controls>
      <source :src="$app.domain + item.attachment" type="audio/mpeg" />
    </audio>
    <v-card
      v-else
      class="d-flex no-border align-center justify-center"
      elevation="0"
      height="220"
    >
      <v-icon color="grey" size="100">mdi-file</v-icon>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "GalleryPreview",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
});
</script>

<style scoped></style>
