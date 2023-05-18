<template>
  <v-chip
    :aria-label="ariaLabel || text"
    :color="color"
    :disabled="disabled"
    :href="href"
    :size="sizeComputed"
    :text-color="textColor || contrast"
    :to="to"
    class="mr-2"
    style="cursor: pointer"
    @click="() => {}"
  >
    <v-icon
      v-if="!shortText && icon"
      :size="icon.includes('numeric') ? 20 : undefined"
    >
      {{ icon }}
    </v-icon>
    <v-img v-if="image" :height="18" :src="image" :width="18" />
    <span v-else class="unselectable">{{ shortText }}</span>
    <v-tooltip :eager="false" activator="parent" location="top">
      {{ text }}
    </v-tooltip>
    <span v-if="old" class="ml-1">{{ text }}</span>
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
    "old",
    "image",
    "ariaLabel",
    "disabledText"
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
