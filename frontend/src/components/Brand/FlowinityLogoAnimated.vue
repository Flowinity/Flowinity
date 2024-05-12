<template>
  <svg
    :id="id"
    viewBox="0 0 741 741"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="741" height="741" :fill="internalColor" />
    <circle cx="370.5" cy="370.5" r="370.5" fill="url(#paint0_linear_370_5)" />
    <path
      d="M108 426C108 409.984 120.984 397 137 397V397C153.016 397 166 409.984 166 426V691H108V426Z"
      :fill="internalColor"
      :id="`${id}-path-0`"
    />
    <path
      d="M583 284C583 266.327 597.327 252 615 252V252C632.673 252 647 266.327 647 284V675H583V284Z"
      :fill="internalColor"
      :id="`${id}-path-3`"
    />
    <path
      d="M196 252C196 220.52 221.52 195 253 195V195C284.48 195 310 220.52 310 252V737H196V252Z"
      :fill="internalColor"
      :id="`${id}-path-1`"
    />
    <path
      d="M413 436C413 404.52 438.52 379 470 379V379C501.48 379 527 404.52 527 436V740H413V436Z"
      :fill="internalColor"
      :id="`${id}-path-2`"
    />
    <defs>
      <linearGradient
        id="paint0_linear_370_5"
        x1="371"
        y1="0"
        x2="371"
        y2="741"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="1"
          :stop-color="$vuetify.theme.current.dark ? 'white' : 'black'"
        />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import { useTheme } from "vuetify";
import anime from "animejs";

const theme = useTheme();

const props = defineProps({
  color: String,
  animate: {
    type: Boolean,
    default: true
  }
});

// random id
const id = `flowinity-logo-animated-${Math.random().toString(36).substring(7)}`;

const internalColor = computed(() => {
  if (!props.color) return theme.current.value.colors.background;
  if (theme.current.value.colors[props.color])
    return theme.current.value.colors[props.color];
  return props.color;
});

const tlUp = anime.timeline({
  easing: "easeInOutQuad",
  duration: 250,
  loop: true,
  loopComplete(anim) {
    if (!props.animate) {
      anim.pause();
    } else {
      anim.play();
    }
  }
});

onMounted(() => {
  // animate each path separately to animate up and down, one by one
  setTimeout(() => {
    tlUp
      .add({
        targets: `#${id}-path-0`,
        translateY: [0, 1000],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-1`,
        translateY: [0, 1000],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-2`,
        translateY: [0, 1000],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-3`,
        translateY: [0, 1000],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-0`,
        translateY: [1000, 0],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-1`,
        translateY: [1000, 0],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-2`,
        translateY: [1000, 0],
        loop: true,
        direction: "alternate"
      })
      .add({
        targets: `#${id}-path-3`,
        translateY: [1000, 0],
        loop: true,
        direction: "alternate"
      })
      .add({
        duration: 1000
      });
  }, 0);
});

watch(
  () => props.animate,
  (newVal) => {
    setTimeout(() => {
      if (tlUp.paused && newVal) tlUp.play();
    }, 0);
  }
);
</script>

<style scoped></style>
