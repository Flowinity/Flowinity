<template>
  <span>
    <v-hover
      :open-delay="$experiments.experiments['HOVER_CHIP_OPEN_DELAY']"
      :close-delay="$experiments.experiments['HOVER_CHIP_CLOSE_DELAY']"
    >
      <template v-slot:default="{ isHovering, props }">
        <v-chip
          v-bind="props"
          class="mr-2"
          :color="color"
          @click="click"
          :to="to"
          :href="href"
          :small="small"
          :x-small="xSmall"
          :x-large="xLarge"
          :large="large"
          :text-color="textColor || contrast"
        >
          <v-icon
            v-if="!shortText"
            :size="icon.includes('numeric') ? 20 : null"
            >{{ icon }}</v-icon
          >
          <span v-else>{{ shortText }}</span>
          <v-expand-x-transition>
            <span
              v-if="isHovering || !$experiments.experiments['HOVER_CHIP_HOVER']"
              >&nbsp;{{ text }}</span
            >
          </v-expand-x-transition>
        </v-chip>
      </template>
    </v-hover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HoverChip",
  props: [
    "text",
    "action",
    "icon",
    "color",
    "to",
    "href",
    "small",
    "xSmall",
    "xLarge",
    "large",
    "shortText",
    "textColor"
  ],
  computed: {
    contrast() {
      return "white";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
});
</script>

<style scoped></style>
