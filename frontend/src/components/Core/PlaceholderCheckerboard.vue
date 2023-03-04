<template>
  <svg
    width="100%"
    height="300"
    viewBox="0 0 800 207"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="display: block"
    preserveAspectRatio="none"
  >
    <g clip-path="url(#clip0_42_10)">
      <rect width="828" height="207" fill="url(#paint0_linear_42_10)" />
      <rect width="69" height="69" :fill="startColor" />
      <rect x="138" width="69" height="69" :fill="startColor" />
      <rect x="69" y="69" width="69" height="69" :fill="startColor" />
      <rect x="138" y="138" width="69" height="69" :fill="startColor" />
      <rect y="138" width="69" height="69" :fill="startColor" />
      <rect x="276" width="69" height="69" :fill="startColor" />
      <rect x="345" y="69" width="69" height="69" :fill="startColor" />
      <rect x="414" y="138" width="69" height="69" :fill="startColor" />
      <rect x="207" y="66" width="69" height="69" :fill="startColor" />
      <rect x="207" y="69" width="69" height="69" :fill="startColor" />
      <rect x="276" y="138" width="69" height="69" :fill="startColor" />
      <rect x="414" width="69" height="69" :fill="startColor" />
      <rect x="483" y="69" width="69" height="69" :fill="startColor" />
      <rect x="552" y="138" width="69" height="69" :fill="startColor" />
      <rect x="552" width="69" height="69" :fill="startColor" />
      <rect x="621" y="69" width="69" height="69" :fill="startColor" />
      <rect x="690" y="138" width="69" height="69" :fill="startColor" />
      <rect x="690" width="69" height="69" :fill="startColor" />
      <rect x="759" y="69" width="69" height="69" :fill="startColor" />
      <rect x="69" width="69" height="69" :fill="endColor" />
      <rect x="138" y="69" width="69" height="69" :fill="endColor" />
      <rect x="207" width="69" height="69" :fill="endColor" />
      <rect x="276" y="69" width="69" height="69" :fill="endColor" />
      <rect x="345" y="138" width="69" height="69" :fill="endColor" />
      <rect x="207" y="138" width="69" height="69" :fill="endColor" />
      <rect x="345" width="69" height="69" :fill="endColor" />
      <rect x="414" y="69" width="69" height="69" :fill="endColor" />
      <rect x="483" y="138" width="69" height="69" :fill="endColor" />
      <rect x="483" width="69" height="69" :fill="endColor" />
      <rect x="552" y="69" width="69" height="69" :fill="endColor" />
      <rect x="621" y="138" width="69" height="69" :fill="endColor" />
      <rect x="621" width="69" height="69" :fill="endColor" />
      <rect x="690" y="69" width="69" height="69" :fill="endColor" />
      <rect x="759" y="138" width="69" height="69" :fill="endColor" />
      <rect x="759" width="69" height="69" :fill="endColor" />
      <rect y="69" width="69" height="69" :fill="endColor" />
      <rect x="69" y="138" width="69" height="69" :fill="endColor" />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_42_10"
        x1="414"
        y1="0"
        x2="414"
        y2="207"
        gradientUnits="userSpaceOnUse"
      >
        <stop :stop-color="startColor" />
        <stop offset="1" :stop-color="startColor" />
      </linearGradient>
      <clipPath id="clip0_42_10">
        <rect width="828" height="207" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PlaceholderCheckerboard",
  props: {
    startColor: {
      type: String,
      default: "#0190ea"
    },
    endColor: {
      type: String,
      default: "#257bf0"
    }
  }
});
</script>

<style scoped></style>
