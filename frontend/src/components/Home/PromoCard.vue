<template>
  <v-card
    :class="{ hover: hover, 'elevation-0': hover }"
    :height="!$vuetify.display.mobile ? height : undefined"
    :width="width"
    class="mx-auto promo-card"
    elevation="6"
    max-width="1000"
    :color="color"
  >
    <div :class="{ container: !$vuetify.display.mobile }">
      <div class="image" v-if="image && (!right || $vuetify.display.mobile)">
        <v-img :src="image" contain />
      </div>
      <div class="text">
        <v-icon v-if="icon" class="text-grey mt-3" size="92">
          {{ icon }}
        </v-icon>
        <v-card-title class="display-1 font-weight-bold text-center initial">
          {{ title }}
        </v-card-title>
        <div class="text-center">
          <slot />
        </div>
      </div>
      <div class="image" v-if="image && right && !$vuetify.display.mobile">
        <v-img :src="image" contain />
      </div>
    </div>

    <v-row style="margin: 0" v-if="false">
      <v-col
        v-if="image && (!right || $vuetify.display.mobile)"
        cols="12"
        md="6"
        style="padding: 0"
      >
        <v-img :src="image" contain />
      </v-col>
      <v-col
        :md="image ? 6 : 12"
        cols="12"
        style="display: flex; padding: 0; align-items: center"
      >
        <div style="align-items: center" class="text-center fix">
          <v-icon v-if="icon" class="text-grey mt-3" size="92">
            {{ icon }}
          </v-icon>
          <v-card-title class="display-1 font-weight-bold">
            {{ title }}
          </v-card-title>
          <div style="padding: 0 16px">
            <slot />
          </div>
        </div>
      </v-col>
      <v-col
        v-if="image && right && !$vuetify.display.mobile"
        cols="12"
        md="6"
        style="padding: 0"
      >
        <v-img :src="image" contain />
      </v-col>
      <v-col v-if="left">
        <slot name="left"></slot>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PromoCard",
  props: [
    "title",
    "image",
    "icon",
    "width",
    "height",
    "hover",
    "left",
    "right",
    "color"
  ]
});
</script>

<style scoped>
.hover {
  background: transparent !important;
}

.hover:hover {
  background: rgba(0, 0, 0, 0.15) !important;
}

.v-theme--amoled .hover:hover {
  background: #121212 !important;
}

.fix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.image {
  flex: 2; /* Take up one-third of the container width for the image */
}

.text {
  flex: 2; /* Take up two-thirds of the container width for the text */
  text-align: center; /* Center the text horizontally */
  padding: 20px; /* Optional: Add some spacing around the text */
}
</style>
