<template>
  <v-card
    class="rounded-xl d-flex flex-column"
    elevation="8"
    style="cursor: pointer"
    :to="to"
    :height="height"
  >
    <v-img
      :src="image"
      class="white--text align-end"
      :gradient="
        rightText
          ? 'to top, rgba(0,0,0,.0), rgba(0,0,0,0.2)'
          : title
          ? 'to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)'
          : null
      "
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
      <slot></slot>
      <v-card-title v-if="title">
        {{ title }}
        <small class="float-end" v-if="subtitle">
          {{ subtitle }}
        </small>
      </v-card-title>
      <v-card-text
        style="position: absolute; top: 0; right: 0; font-size: 18px"
        v-if="rightText"
        :style="blackText ? 'color: black !important;' : 'color: white'"
      >
        {{ rightText }}
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DynamicCard",
  props: {
    to: {
      type: String,
      required: false
    },
    image: {
      type: String,
      default: "https://i.troplo.com/i/a050d6f271c3.png"
    },
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    rightText: {
      type: String,
      required: false
    },
    blackText: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    }
  }
});
</script>

<style scoped></style>
