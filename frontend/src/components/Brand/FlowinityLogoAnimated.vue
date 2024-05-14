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
      d="M108 426C108 409.984 120.984 397 137 397C153.016 397 166 409.984 166 426V691H108V426Z"
      :fill="internalColor"
      :id="`${id}-path-0`"
      style="transform: translateY(1000px)"
    />
    <path
      d="M583 284C583 266.327 597.327 252 615 252V252C632.673 252 647 266.327 647 284V691H583V284Z"
      :fill="internalColor"
      :id="`${id}-path-3`"
      style="transform: translateY(1000px)"
    />
    <path
      d="M196 252C196 220.52 221.52 195 253 195V195C284.48 195 310 220.52 310 252V739H196V252Z"
      :fill="internalColor"
      :id="`${id}-path-1`"
      style="transform: translateY(1000px)"
    />
    <path
      d="M413 436C413 404.52 438.52 379 470 379V379C501.48 379 527 404.52 527 436V741H413V436Z"
      :fill="internalColor"
      :id="`${id}-path-2`"
      style="transform: translateY(1000px)"
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
import { computed, onMounted, ref, watch } from "vue";
import { useTheme } from "vuetify";
import anime from "animejs";

const theme = useTheme();

const props = defineProps({
  color: String,
  animate: {
    type: Boolean,
    default: true
  },
  skipInit: {
    type: Boolean,
    default: false
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

const hasPlayedInit = ref(false);

const tlLoading = anime.timeline({
  easing: "easeInOutQuad",
  duration: 250,
  loop: true,
  autoplay: false,
  loopComplete(anim) {
    if (!props.animate) {
      anim.pause();
    } else {
      anim.play();
    }
  }
});

const tlInit = anime.timeline({
  easing: "easeInOutQuad",
  duration: 250,
  loop: false,
  autoplay: true
});

onMounted(() => {
  // animate each path separately to animate up and down, one by one
  // play tlInit, all paths will start at the bottom and animate up
  if (props.skipInit) {
    hasPlayedInit.value = true;
  } else {
    setTimeout(() => {
      tlInit
        .add({
          targets: `#${id}-path-0`,
          translateY: [1000, 0],
          delay: 50
        })
        .add({
          targets: `#${id}-path-1`,
          translateY: [1000, 0] // Animate from 1000px translateY to 0px
        })
        .add({
          targets: `#${id}-path-2`,
          translateY: [1000, 0] // Animate from 1000px translateY to 0px
        })
        .add({
          targets: `#${id}-path-3`,
          translateY: [1000, 0] // Animate from 1000px translateY to 0px
        }).complete = () => {
        hasPlayedInit.value = true;
      };
      // animate each path separately to animate up and down, one by one
    }, 0);
  }

  tlLoading
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
  if (!props.skipInit) tlLoading.pause();
});

watch(
  () => props.animate,
  (newVal) => {
    setTimeout(() => {
      if (!hasPlayedInit.value) return;
      if (tlLoading.paused && newVal) tlLoading.play();
    }, 0);
  }
);
</script>

<style scoped></style>
