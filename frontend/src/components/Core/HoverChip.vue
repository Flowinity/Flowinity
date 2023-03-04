<template>
  <v-chip
    class="mr-2"
    :color="color"
    @click="() => {}"
    :to="to"
    :href="href"
    :text-color="textColor || contrast"
    :disabled="disabled"
    :size="sizeComputed"
    style="cursor: pointer"
    :aria-label="ariaLabel || text"
  >
    <v-icon
      v-if="!shortText && icon"
      :size="icon.includes('numeric') ? 20 : undefined"
    >
      {{ icon }}
    </v-icon>
    <v-img :src="image" :width="18" :height="18" v-if="image" />
    <span v-else>{{ shortText }}</span>
    <v-tooltip activator="parent" location="top">
      {{ text }}
    </v-tooltip>
    <span class="ml-1" v-if="old">{{ text }}</span>
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
