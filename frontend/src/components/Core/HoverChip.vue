<template>
  <v-chip
    v-if="!old"
    class="mr-2"
    :color="color"
    @click="() => {}"
    :to="to"
    :href="href"
    :text-color="textColor || contrast"
    :disabled="disabled"
    :size="sizeComputed"
    style="cursor: pointer"
  >
    <v-icon v-if="!shortText" :size="icon.includes('numeric') ? 20 : undefined">
      {{ icon }}
    </v-icon>
    <span v-else>{{ shortText }}</span>
    <v-tooltip activator="parent" location="top">
      {{ text }}
    </v-tooltip>
    <!--<v-expand-x-transition>
            <span
              v-if="isHovering && $experiments.experiments['HOVER_CHIP_HOVER']"
              >&nbsp;{{ text }}</span
            >
          </v-expand-x-transition>-->
  </v-chip>
  <v-chip
    v-if="old"
    class="mr-2"
    :color="color"
    @click="() => {}"
    :to="to"
    :href="href"
    :text-color="textColor || contrast"
    :disabled="disabled"
    :size="sizeComputed"
    style="cursor: pointer"
  >
    <v-icon v-if="!shortText" :size="icon.includes('numeric') ? 20 : undefined">
      {{ icon }}
    </v-icon>
    <span v-else>{{ shortText }}</span>
    <span class="ml-1">{{ text }}</span>
  </v-chip>
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
    "textColor",
    "disabled",
    "click",
    "size",
    "old"
  ],
  computed: {
    contrast() {
      return "white";
    },
    // if other components still use the old Vuetify props
    sizeComputed() {
      if (this.small) return "small";
      if (this.xSmall) return "x-small";
      if (this.xLarge) return "x-large";
      if (this.large) return "large";
      return this.size;
    }
  }
});
</script>

<style scoped></style>
