<template>
  <v-list-item class="skeleton" color="transparent">
    <template v-if="pfp" v-slot:prepend>
      <v-avatar
        :class="{
          'skeleton-loader': animate,
          'skeleton-loader-no-animate': !animate
        }"
        size="40"
      ></v-avatar>
    </template>
    <p>
      <small
        :class="{
          'skeleton-loader': animate,
          'skeleton-loader-no-animate': !animate
        }"
        class="text-grey small-text"
      ></small>
    </p>

    <span
      :class="{
        'skeleton-loader': animate,
        'skeleton-loader-no-animate': !animate
      }"
      class="message-contents"
    ></span>
  </v-list-item>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "MessageSkeleton",
  props: {
    animate: {
      type: Boolean,
      default: true
    },
    pfp: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style lang="scss" scoped>
.skeleton-loader-no-animate {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  backdrop-filter: brightness(1.5);
}

.skeleton-loader {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
}

.v-theme--amoled .skeleton-loader,
.v-theme--amoled .skeleton-loader-no-animate {
  background: #121212;
}

.skeleton-loader {
  backdrop-filter: brightness(1.5);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
        90deg,
        rgba(var(--skeleton-loader-bg-alt), 0) 0,
        rgba(var(--skeleton-loader-bg-alt), 0.2) 20%,
        rgba(var(--skeleton-loader-bg-alt), 0.5) 60%,
        rgba(var(--skeleton-loader-bg-alt), 0)
    );
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.small-text {
  width: 200px;
}

.message-contents {
  width: 100%;
  height: 1.15em;
}
</style>
