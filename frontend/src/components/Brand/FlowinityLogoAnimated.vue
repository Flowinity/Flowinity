<template>
  <svg
    v-if="!$experiments.experiments.NEW_BRANDING"
    :id="id"
    viewBox="0 0 741 741"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="741" height="741" :fill="internalColor" />
    <circle cx="370.5" cy="370.5" r="370.5" :fill="fillColor" />
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
      <PridePattern :id="`${id}_pride_gradient`" />
    </defs>
  </svg>
  <svg
    v-else
    :id="id"
    viewBox="0 0 472 472"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="glow-on-hover"
  >
    <path
      :id="`${id}-path-0`"
      d="M202.542 235.958L235.549 202.95L268.609 236.01L235.601 269.018L202.542 235.958Z"
      :fill="fillColor"
      :stroke="fillColor"
      stroke-width="20"
    />
    <g id="outer-paths" style="transform-origin: 50% 50%">
      <path
        :id="`${id}-path-1`"
        d="M380.043 236.015L380.043 236.008V236.001C380.038 228.808 377.185 221.894 372.085 216.794L202.49 47.1989L235.547 14.1421L416.383 194.978C439.044 217.639 439.044 254.381 416.383 277.041L329.951 363.473L296.892 330.414L372.085 255.22C377.176 250.129 380.037 243.218 380.043 236.015Z"
        fill="transparent"
        :stroke="fillColor"
        stroke-width="20"
      />
      <path
        :id="`${id}-path-2`"
        d="M91.5139 235.78L91.5139 235.788V235.795C91.5185 242.987 94.3719 249.902 99.4717 255.002L269.067 424.597L236.01 457.653L55.1735 276.817C32.5124 254.156 32.5131 217.415 55.1737 194.754L141.605 108.322L174.665 141.382L99.4718 216.575C94.3806 221.666 91.5197 228.577 91.5139 235.78Z"
        fill="transparent"
        :stroke="fillColor"
        stroke-width="20"
      />
    </g>
    <PridePattern :id="`${id}_pride_gradient`" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useTheme } from "vuetify";
import anime from "animejs";
import { useExperimentsStore } from "@/store/experiments.store";
import PridePattern from "@/components/Brand/PridePattern.vue";
import { PrideVariant } from "@/types/pride";

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

const fillColor = computed(() => {
  // /* is not a typo
  return experimentsStore.experiments.PRIDE
    ? `url(#${id}_pride_gradient)/*`
    : theme.current.value.dark
    ? "white/*"
    : "black/*";
});

const hasPlayedInit = ref(false);

const tlLoading = anime.timeline({
  duration: 250,
  loop: true,
  autoplay: false,
  easing: "easeInOutQuad",
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

const experimentsStore = useExperimentsStore();

const FILL_DURATION = 100;
const STROKE_DURATION = 1000;

onMounted(() => {
  // animate each path separately to animate up and down, one by one
  // play tlInit, all paths will start at the bottom and animate up
  if (props.skipInit) {
    if (experimentsStore.experiments.NEW_BRANDING) {
      tlInit.add({
        targets: `#${id} path`,
        // gradient
        fill: fillColor.value,
        stroke: fillColor.value,
        duration: 0,
        easing: "easeInOutQuad"
      }).complete = () => {
        hasPlayedInit.value = true;
      };
    } else {
      tlInit
        .add({
          targets: `#${id}-path-0`,
          translateY: [1000, 0],
          duration: 0
        })
        .add({
          targets: `#${id}-path-1`,
          translateY: [1000, 0],
          duration: 0
        })
        .add({
          targets: `#${id}-path-2`,
          translateY: [1000, 0],
          duration: 0
        })
        .add({
          targets: `#${id}-path-3`,
          translateY: [1000, 0],
          duration: 0
        }).complete = () => {
        hasPlayedInit.value = true;
      };
    }
  } else {
    if (experimentsStore.experiments.NEW_BRANDING) {
      setTimeout(() => {
        tlInit
          .add({
            targets: `#${id}-path-1`,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: "easeInOutSine",
            duration: STROKE_DURATION,
            loop: true,
            fill: "transparent",
            stroke: fillColor.value
          })
          .add({
            targets: `#${id}-path-2`,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: "easeInOutSine",
            duration: STROKE_DURATION,
            fill: "transparent",
            stroke: fillColor.value
          })
          .add({
            targets: `#${id} path`,
            // gradient
            fill: fillColor.value,
            stroke: fillColor.value,
            duration: 500,
            easing: "easeInOutQuad"
          })
          .add({
            targets: `#${id}`,
            duration: 1000,
            begin() {
              document.getElementById(id)?.classList.add("force-glow");
            },
            complete() {
              document.getElementById(id)?.classList.remove("force-glow");
            }
          }).complete = () => {
          hasPlayedInit.value = true;
        };
      }, 0);
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
            translateY: [1000, 0]
          })
          .add({
            targets: `#${id}-path-2`,
            translateY: [1000, 0]
          })
          .add({
            targets: `#${id}-path-3`,
            translateY: [1000, 0]
          }).complete = () => {
          hasPlayedInit.value = true;
        };
      }, 0);
    }
    tlInit.play();
  }
  if (experimentsStore.experiments.NEW_BRANDING) {
    tlLoading
      .add({
        targets: `#${id} #outer-paths`,
        rotate: [0, 180],
        duration: 1500,
        loop: true,
        easing: "easeInOutElastic"
      })
      .add({
        duration: 200
      })
      .add({
        targets: `#${id} #outer-paths`,
        rotate: [180, 360],
        duration: 1500,
        loop: true,
        easing: "easeInOutElastic"
      })
      .add({
        duration: 1000
      });
  } else {
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
  }
  if (!props.skipInit) tlLoading.pause();
  if (props.skipInit) tlLoading.play();
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

// only new branding has glowing effect
const glowFilter = computed(() => {
  const pride = useExperimentsStore().experiments.PRIDE as PrideVariant;
  const gradient = PrideVariant.gradient(pride);
  return `drop-shadow(0 0 12px ${gradient?.[0]?.stopColor || fillColor.value})`;
});
</script>

<style scoped>
.glow-on-hover {
  transition: filter 0.3s ease;
}

.glow-on-hover:hover,
.force-glow {
  filter: v-bind(glowFilter);
}
</style>
