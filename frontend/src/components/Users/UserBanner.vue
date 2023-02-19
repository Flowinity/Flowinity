<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-img
      v-bind="props"
      :src="banner"
      aspect-ratio="16/9"
      id="user-header"
      cover
      :min-height="!height ? 200 : undefined"
      lazy-src="https://i.troplo.com/i/a050d6f271c3.png"
      :max-height="user.banner ? 350 : 150"
      :height="height"
    >
      <transition
        appear
        v-if="$user.user?.id === user.id"
        name="fade-transition"
        :duration="{ enter: 300, leave: 300 }"
      >
        <v-btn
          icon
          class="rounded-xl"
          v-if="isHovering"
          style="position: absolute; top: 10px; right: 10px"
          @click="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </transition>
    </v-img>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserBanner",
  props: ["user", "height"],
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    banner() {
      return this.user.banner
        ? this.$app.domain + this.user.banner
        : "https://i.troplo.com/i/a050d6f271c3.png";
    }
  }
});
</script>

<style scoped></style>
