<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="$t('generic.search')"
    append-inner-icon="mdi-close"
    class="rounded-xl"
    @click:append-inner="
      $emit('update:modelValue', '');
      $emit('refreshGallery');
    "
    v-on:keyup.enter="
      $emit('update:modelValue', modelValue);
      $emit('refreshGallery');
    "
    @focus="focused = true"
    @blur="focused = false"
    @change="val = $event.target.value"
  ></v-text-field>
  <v-scroll-y-transition>
    <v-card
      v-show="focused"
      style="position: absolute; z-index: 2"
      color="toolbar"
    >
      {{ mode }}
      <v-container v-if="!mode">
        <v-kbd>user:{{ $user.user?.username || "username" }}</v-kbd>
        Filter by user
        <br />
        <v-kbd>before:2023-01-01</v-kbd>
        Before a certain date
        <br />
        <v-kbd>after:2023-01-01</v-kbd>
        After a certain date
        <br />
        <v-kbd>during:2023-01-01</v-kbd>
        During a certain date
      </v-container>
      <v-container v-else>prototype {{ mode }}</v-container>
    </v-card>
  </v-scroll-y-transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GallerySearchMode } from "@/gql/graphql";

export default defineComponent({
  name: "GalleryTextField",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue", "refreshGallery"],
  data() {
    return {
      focused: false,
      val: ""
    };
  },
  computed: {
    mode(): GallerySearchMode | null {
      console.log(this.val);
      if (this.modelValue.startsWith("user:")) {
        return GallerySearchMode.USER;
      } else if (this.modelValue.startsWith("before:")) {
        return GallerySearchMode.BEFORE;
      } else if (this.modelValue.startsWith("after:")) {
        return GallerySearchMode.AFTER;
      } else if (this.modelValue.startsWith("during:")) {
        return GallerySearchMode.DURING;
      } else {
        return null;
      }
    }
  }
});
</script>

<style scoped></style>
