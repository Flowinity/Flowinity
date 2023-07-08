<template>
  <svg
    fill="none"
    height="300"
    preserveAspectRatio="none"
    style="display: block"
    viewBox="0 0 800 207"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_42_10)">
      <rect fill="url(#paint0_linear_42_10)" height="207" width="828"/>
      <rect :fill="startColor" height="69" width="69"/>
      <rect :fill="startColor" height="69" width="69" x="138"/>
      <rect :fill="startColor" height="69" width="69" x="69" y="69"/>
      <rect :fill="startColor" height="69" width="69" x="138" y="138"/>
      <rect :fill="startColor" height="69" width="69" y="138"/>
      <rect :fill="startColor" height="69" width="69" x="276"/>
      <rect :fill="startColor" height="69" width="69" x="345" y="69"/>
      <rect :fill="startColor" height="69" width="69" x="414" y="138"/>
      <rect :fill="startColor" height="69" width="69" x="207" y="66"/>
      <rect :fill="startColor" height="69" width="69" x="207" y="69"/>
      <rect :fill="startColor" height="69" width="69" x="276" y="138"/>
      <rect :fill="startColor" height="69" width="69" x="414"/>
      <rect :fill="startColor" height="69" width="69" x="483" y="69"/>
      <rect :fill="startColor" height="69" width="69" x="552" y="138"/>
      <rect :fill="startColor" height="69" width="69" x="552"/>
      <rect :fill="startColor" height="69" width="69" x="621" y="69"/>
      <rect :fill="startColor" height="69" width="69" x="690" y="138"/>
      <rect :fill="startColor" height="69" width="69" x="690"/>
      <rect :fill="startColor" height="69" width="69" x="759" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="69"/>
      <rect :fill="endColor" height="69" width="69" x="138" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="207"/>
      <rect :fill="endColor" height="69" width="69" x="276" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="345" y="138"/>
      <rect :fill="endColor" height="69" width="69" x="207" y="138"/>
      <rect :fill="endColor" height="69" width="69" x="345"/>
      <rect :fill="endColor" height="69" width="69" x="414" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="483" y="138"/>
      <rect :fill="endColor" height="69" width="69" x="483"/>
      <rect :fill="endColor" height="69" width="69" x="552" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="621" y="138"/>
      <rect :fill="endColor" height="69" width="69" x="621"/>
      <rect :fill="endColor" height="69" width="69" x="690" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="759" y="138"/>
      <rect :fill="endColor" height="69" width="69" x="759"/>
      <rect :fill="endColor" height="69" width="69" y="69"/>
      <rect :fill="endColor" height="69" width="69" x="69" y="138"/>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_42_10"
        gradientUnits="userSpaceOnUse"
        x1="414"
        x2="414"
        y1="0"
        y2="207"
      >
        <stop :stop-color="startColor"/>
        <stop :stop-color="startColor" offset="1"/>
      </linearGradient>
      <clipPath id="clip0_42_10">
        <rect fill="white" height="207" width="828"/>
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
import {defineComponent} from "vue";

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
