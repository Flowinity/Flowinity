<template>
  <v-card
    :class="{ hover: hover, 'elevation-0': hover }"
    :height="!$vuetify.display.mobile ? height : undefined"
    :width="width"
    class="mx-auto promo-card"
    elevation="6"
    max-width="1000"
  >
    <v-row style="margin: 0">
      <v-col v-if="image" cols="12" md="6" style="padding: 0">
        <v-img :src="image" contain></v-img>
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
            <slot></slot>
          </div>
        </div>
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
  props: ["title", "image", "icon", "width", "height", "hover", "left"]
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
</style>
