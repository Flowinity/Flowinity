<template>
  <h1
    style="z-index: 10; cursor: pointer; font-size: 32px"
    class="text-gradient unselectable ml-4"
    @click="$router.push('/')"
    id="tpu-brand-logo"
    :title="event === 'j' ? 'Jitsi Anniversary' : 'TroploPrivateUploader'"
    v-if="!$vuetify.display.mobile && event !== 'bc' && event !== 'ph'"
  >
    TPU
    <v-hover v-slot="{ isHovering, props }" v-if="event === 'pi'">
      <span v-bind="props" class="ml-1">
        <template v-if="isHovering">
          <span style="font-size: 1.15em">
            {{ Math.PI }}
          </span>
        </template>
        <template v-else>
          <span style="font-size: 1.15em">π</span>
        </template>
      </span>
    </v-hover>
    <v-icon
      class="text-gradient"
      size="23"
      style="bottom: 0.05em"
      v-if="event === 'bd'"
    >
      mdi-numeric-1-box
    </v-icon>
    <v-icon
      class="text-gradient"
      size="23"
      style="bottom: 0.05em"
      v-if="event === 'bd'"
    >
      mdi-numeric-7-box
    </v-icon>
    <v-img
      src="https://i.troplo.com/i/1bcf4db450ba.svg"
      width="32"
      height="32"
      style="position: relative; top: 0.15em; display: inline-block"
      v-if="event === 'j'"
    ></v-img>
    <v-icon
      class="text-gradient ml-n1"
      size="34"
      style="bottom: 0.05em"
      v-if="event === '420'"
    >
      mdi-cannabis
    </v-icon>
  </h1>
  <template v-if="event === 'bc'">
    <v-card-title
      id="bettercompass-title"
      class="text-gradient"
      style="cursor: pointer"
      title="BetterCompass is 1 year old today!"
    >
      BetterCompass
      <v-icon class="text-gradient" size="23" style="bottom: 0.05em">
        mdi-numeric-1-box
      </v-icon>
    </v-card-title>
    <v-btn disabled class="ml-n5">Dev</v-btn>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LogoEasterEgg",
  computed: {
    event() {
      const date = this.$date().format("MMDD");
      switch (date) {
        case "0314":
          return "pi";
        case "0317":
          return "bc";
        case "0331":
          return "bd";
        case "0401":
          return "j";
        case "0420":
          return "420";
        case "0101":
          return "ny";
        case "1225":
          return "xmas";
        case "1001":
          return "halloween";
        case "0704":
          return "independence";
        case "0505":
          return "cincodemayo";
        case "0908":
          return "labor";
        case "1101":
          return "veterans";
        default:
          return null;
      }
    }
  }
});
</script>

<style scoped></style>
