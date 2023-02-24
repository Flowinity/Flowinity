<template>
  <v-hover v-slot="{ isHovering, props }">
    <UploadCropper
      title="Upload Banner"
      v-model="dialog"
      @finish="uploadBanner"
      aspect-ratio="5.4"
    />
    <v-img
      v-bind="props"
      :src="banner"
      aspect-ratio="5"
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
import "cropperjs/dist/cropper.css";
import { defineComponent } from "vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";

export default defineComponent({
  name: "UserBanner",
  components: { UploadCropper },
  props: ["user", "height"],
  emits: ["refreshUser"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    async uploadBanner(file: File) {
      const formData = new FormData();
      formData.append("banner", file);
      await this.axios.post("/user/banner", formData);
      this.$emit("refreshUser");
    }
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

<style scoped>
img {
  display: block;
  max-width: 100%;
}
</style>
