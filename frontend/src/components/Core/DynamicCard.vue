<template>
  <v-card
    :height="<string>height"
    :to="to"
    class="rounded-xl d-flex flex-column"
    elevation="8"
    style="cursor: pointer"
  >
    <v-img
      :gradient="
        rightText
          ? 'to top, rgba(0,0,0,.0), rgba(0,0,0,0.2)'
          : title
          ? 'to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)'
          : undefined
      "
      :src="<string>image"
      class="white--text align-end"
      :cover="true"
      transition="none"
    >
      <template v-slot:placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular color="grey lighten-5" indeterminate />
        </v-row>
      </template>
      <slot></slot>
      <v-card-title v-if="title">
        {{ title }}
        <small v-if="subtitle" class="float-end">
          {{ subtitle }}
        </small>
      </v-card-title>
      <v-card-text
        v-if="rightText"
        :style="blackText ? 'color: black !important;' : 'color: white'"
        style="position: absolute; top: 0; right: 0; font-size: 18px"
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
