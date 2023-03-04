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
      :max-height="hasRealBanner ? 350 : 150"
      :height="height"
      :gradient="
        collection ? 'to bottom, rgba(0,0,0,.1), rgba(0,0,0,0.8)' : undefined
      "
      :class="{ 'align-end': collection }"
    >
      <PlaceholderCheckerboard
        :start-color="user?.plan?.id === 6 || gold ? '#FBC02D' : undefined"
        :end-color="user?.plan?.id === 6 || gold ? '#f5b217' : undefined"
        v-if="banner === 'placeholder'"
        style="position: absolute; top: 0; left: 0; z-index: -2"
      ></PlaceholderCheckerboard>
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
          v-if="banner !== 'placeholder'"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
      <transition
        appear
        v-if="canEdit"
        name="fade-transition"
        :duration="{ enter: 300, leave: 300 }"
      >
        <v-btn
          icon
          v-if="isHovering"
          style="position: absolute; top: 10px; right: 10px"
          @click="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </transition>
      <slot></slot>
    </v-img>
  </v-hover>
</template>

<script lang="ts">
import "cropperjs/dist/cropper.css";
import { defineComponent } from "vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import PlaceholderCheckerboard from "@/components/Core/PlaceholderCheckerboard.vue";

export default defineComponent({
  name: "UserBanner",
  components: { PlaceholderCheckerboard, UploadCropper },
  props: ["user", "height", "collection", "gold"],
  emits: ["refreshUser"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    async uploadBanner(file: File) {
      if (this.user) {
        const formData = new FormData();
        formData.append("banner", file);
        await this.axios.post("/user/banner", formData);
        this.$emit("refreshUser");
      } else {
        const formData = new FormData();
        formData.append("banner", file);
        await this.axios.post(
          `/collections/${this.collection?.id}/banner`,
          formData
        );
        this.$emit("refreshUser");
      }
    }
  },
  computed: {
    banner() {
      if (this.user) {
        return this.user.banner
          ? this.$app.domain + this.user.banner
          : "placeholder";
      } else if (this.collection) {
        if (this.collection?.image) {
          return this.$app.domain + this.collection.image;
        } else if (this.collection?.preview?.attachment?.attachment) {
          return (
            this.$app.domain + this.collection.preview.attachment.attachment
          );
        } else {
          return "placeholder";
        }
      } else {
        return "placeholder";
      }
    },
    hasRealBanner() {
      if (this.user) {
        return this.user.banner;
      } else if (this.collection) {
        return this.collection.image;
      }
    },
    canEdit() {
      if (this.user) {
        return this.user.id === this.$user.user?.id;
      } else if (this.collection) {
        return this.collection.permissionsMetadata?.configure;
      }
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
