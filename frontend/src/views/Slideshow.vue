<template>
  <span>
    <v-hover v-slot="{ isHovering, props }">
      <v-carousel
        v-model="model"
        :height="height"
        :interval="interval"
        cycle
        hide-delimiters
        show-arrows="hover"
        v-bind="props"
      >
        <v-carousel-item
          v-for="image in slideshow"
          :key="image.id"
          :src="`${$app.domain}${image.attachment.attachment}`"
          contain
        >
          <template #placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
              <v-progress-circular color="grey lighten-5" indeterminate />
            </v-row>
          </template>
          <v-chip
            v-if="isHovering"
            class="elevation-10 slide-fab"
            elevation="2"
            style="position: absolute; bottom: 20px; left: 50%"
            @click="copy(image.attachment.attachment)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-chip>
        </v-carousel-item>
      </v-carousel>
    </v-hover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      slideshow: [] as any[],
      config: {
        speed: 5
      },
      model: 0,
      id: undefined as string | undefined
    };
  },
  computed: {
    interval() {
      return this.config.speed * 1000;
    },
    height() {
      return this.$vuetify.display.height;
    }
  },
  watch: {
    model() {
      if (this.model === this.slideshow.length - 3) {
        this.getSlideshow();
      }
    }
  },
  mounted() {
    const url = new URL(window.location.href);
    this.id = url.pathname.split("/")[2];
    this.getSlideshow();
    this.getSlideshowConfig();
  },
  methods: {
    copy(text: string) {
      navigator.clipboard.writeText(this.$app.domain + text);
    },
    async getSlideshow() {
      const { data } = await this.axios.get(`/slideshows/${this.id}`);
      this.slideshow = data;
    },
    async getSlideshowConfig() {
      const { data } = await this.axios.get(`/slideshows/${this.id}/config`);
      this.config = data;
    }
  }
});
</script>

<style>
:root {
  background-color: transparent !important;
  overflow: hidden;
}

.v-window__next {
  float: right !important;
  position: absolute;
  right: 1px;
}

.img {
  max-width: 100% !important;
}
</style>
