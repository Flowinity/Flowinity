<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="$t('generic.search')"
    append-inner-icon="mdi-magnify"
    class="rounded-xl"
    @click:append-inner="
      $emit('update:modelValue', modelValue);
      $emit('submit');
      focused = false;
    "
    v-on:keyup.enter="
      $emit('update:modelValue', modelValue);
      $emit('submit');
      focused = false;
    "
    @focus="focused = true"
    @blur="focused = false"
    @change="val = $event.target.value"
    :autofocus="autofocus"
    @update:modelValue="focused = true"
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
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return {
      focused: false,
      val: ""
    };
  },
  computed: {
    mode(): GallerySearchMode | null {
      if (this.modelValue.startsWith("user:")) {
        return GallerySearchMode.User;
      } else if (this.modelValue.startsWith("before:")) {
        return GallerySearchMode.Before;
      } else if (this.modelValue.startsWith("after:")) {
        return GallerySearchMode.After;
      } else if (this.modelValue.startsWith("during:")) {
        return GallerySearchMode.During;
      } else {
        return null;
      }
    }
  }
});
</script>

<style scoped></style>
