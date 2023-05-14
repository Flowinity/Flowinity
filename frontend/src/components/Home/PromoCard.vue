<template>
  <v-card
    class="mx-auto mt-6"
    elevation="6"
    max-width="1000"
    :width="width"
    :height="!$vuetify.display.mobile ? height : undefined"
    :class="{ hover: hover, 'elevation-0': hover }"
  >
    <v-row style="margin: 0">
      <v-col cols="12" md="6" v-if="image" style="padding: 0">
        <v-img :src="image" contain></v-img>
      </v-col>
      <v-col
        cols="12"
        :md="image ? 6 : 12"
        style="display: flex; padding: 0; align-items: center"
      >
        <div
          :class="{ fix: image && !$vuetify.display.mobile }"
          style="align-items: center"
        >
          <v-icon v-if="icon" size="92" class="text-grey mt-3">
            {{ icon }}
          </v-icon>
          <v-card-title class="display-1 font-weight-bold mt-n1 mb-n1">
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
export default {
  name: "PromoCard",
  props: ["title", "image", "icon", "width", "height", "hover", "left"]
};
</script>

<style scoped>
.hover {
  background: transparent !important;
}
.hover:hover {
  background-color: rgb(24, 24, 24) !important;
}
.fix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
