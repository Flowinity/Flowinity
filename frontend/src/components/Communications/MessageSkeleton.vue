<template>
  <v-list-item color="transparent" class="skeleton">
    <template v-slot:prepend>
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
        class="text-grey small-text"
        :class="{
          'skeleton-loader': animate,
          'skeleton-loader-no-animate': !animate
        }"
      ></small>
    </p>

    <span
      class="message-contents"
      :class="{
        'skeleton-loader': animate,
        'skeleton-loader-no-animate': !animate
      }"
    ></span>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageSkeleton",
  props: {
    animate: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style scoped lang="scss">
.skeleton-loader-no-animate {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
}

.v-theme--dark .skeleton-loader-no-animate {
  background-color: #202020;
}

.v-theme--light .skeleton-loader-no-animate {
  background-color: #f5f5f5;
}

.skeleton-loader {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
}

.v-theme--dark .skeleton-loader {
  background-color: #202020;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#242424, 0) 0,
      rgba(#242424, 0.2) 20%,
      rgba(#242424, 0.5) 60%,
      rgba(#242424, 0)
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

.v-theme--light .skeleton-loader {
  background-color: #f5f5f5;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#cbcbcb, 0) 0,
      rgba(#cbcbcb, 0.2) 20%,
      rgba(#cbcbcb, 0.5) 60%,
      rgba(#cbcbcb, 0)
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
