<template>
  <CoreDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
  >
    <template v-slot:title>TPU QuickSwitcher</template>
    <v-container v-if="modelValue">
      <v-autocomplete
        @keydown.enter="handleEnter($event.target.value)"
        v-model="search"
        auto-select-first
        :items="$app.quickSwitcher"
        item-title="name"
        label="Search"
        outlined
        autofocus
        return-object
        ref="input"
        @select="handleEnter($event.target.value)"
      ></v-autocomplete>
    </v-container>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "QuickSwitcher",
  components: { CoreDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      search: null as { route: string; name: string } | null,
      searchInput: ""
    };
  },
  methods: {
    handleEnter(content: string) {
      if (!content && this.$app.lastRoute) {
        this.$router.push(this.$app.lastRoute);
        return;
      }
      if (this.search) {
        this.$router.push(this.search.route);
      }
      const filter = this.$app.quickSwitcher.filter(
        (qs: { route: string; name: string }) =>
          qs.name.toLowerCase().startsWith(content.toLowerCase())
      );
      if (filter?.length) {
        this.$router.push(filter[0].route);
        this.$emit("update:modelValue", false);
      }
    }
  }
});
</script>

<style scoped></style>
