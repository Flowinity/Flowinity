<template>
  <svg
    viewBox="0 0 404 458"
    :fill="internalColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M156.205 320.54L156.18 320.565L247.77 412.156L201.975 457.951L19.6688 275.644C-6.10583 249.87 -6.10577 208.081 19.6689 182.306L110.385 91.5899L156.18 137.385L76.3701 217.195C69.864 223.701 69.864 234.249 76.3701 240.756C89.9386 254.324 110.385 274.771 110.385 274.771L110.411 274.745L156.205 320.54ZM156.231 228.925L201.976 183.18L247.771 228.975L202.026 274.72L156.231 228.925ZM156.183 45.7921L201.975 2.59544e-05L384.282 182.307C410.056 208.081 410.056 249.87 384.282 275.644L293.566 366.36L247.771 320.565L327.583 240.753C330.702 237.635 332.459 233.396 332.462 228.973C332.46 224.558 330.707 220.316 327.583 217.192C287.104 176.713 156.183 45.7921 156.183 45.7921Z"
      fill="white"
    />
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
//
// const hasPlayedInit = ref(false);
//
// const tlLoading = anime.timeline({
//   easing: "easeInOutQuad",
//   duration: 250,
//   loop: true,
//   autoplay: false,
//   loopComplete(anim) {
//     if (!props.animate) {
//       anim.pause();
//     } else {
//       anim.play();
//     }
//   }
// });
//
// const tlInit = anime.timeline({
//   easing: "easeInOutQuad",
//   duration: 250,
//   loop: false,
//   autoplay: true
// });
//
// onMounted(() => {
//   // animate each path separately to animate up and down, one by one
//   // play tlInit, all paths will start at the bottom and animate up
//   if (props.skipInit) {
//     hasPlayedInit.value = true;
//   } else {
//     setTimeout(() => {
//       tlInit
//         .add({
//           targets: `#${id}-path-0`,
//           translateY: [1000, 0],
//           delay: 50
//         })
//         .add({
//           targets: `#${id}-path-1`,
//           translateY: [1000, 0] // Animate from 1000px translateY to 0px
//         })
//         .add({
//           targets: `#${id}-path-2`,
//           translateY: [1000, 0] // Animate from 1000px translateY to 0px
//         })
//         .add({
//           targets: `#${id}-path-3`,
//           translateY: [1000, 0] // Animate from 1000px translateY to 0px
//         }).complete = () => {
//         hasPlayedInit.value = true;
//       };
//       // animate each path separately to animate up and down, one by one
//     }, 0);
//   }
//
//   tlLoading
//     .add({
//       targets: `#${id}-path-0`,
//       translateY: [0, 1000],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-1`,
//       translateY: [0, 1000],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-2`,
//       translateY: [0, 1000],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-3`,
//       translateY: [0, 1000],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-0`,
//       translateY: [1000, 0],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-1`,
//       translateY: [1000, 0],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-2`,
//       translateY: [1000, 0],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       targets: `#${id}-path-3`,
//       translateY: [1000, 0],
//       loop: true,
//       direction: "alternate"
//     })
//     .add({
//       duration: 1000
//     });
//   if (!props.skipInit) tlLoading.pause();
//   if (props.skipInit) tlLoading.play();
// });
//
// watch(
//   () => props.animate,
//   (newVal) => {
//     setTimeout(() => {
//       if (!hasPlayedInit.value) return;
//       if (tlLoading.paused && newVal) tlLoading.play();
//     }, 0);
//   }
// );
</script>

<style scoped></style>
