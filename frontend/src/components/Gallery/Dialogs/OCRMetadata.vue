<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    max-height="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{$t("gallery.actions.ocr.title")}}
    </template>
    <v-card-text>
      <v-textarea class="mb-n4" disabled auto-grow variant="outlined" rows="1" :model-value="$app.dialogs.ocr.text"></v-textarea>
      <small>
        {{$t("gallery.actions.ocr.tip")}}
      </small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        {{$t("generic.close")}}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { CollectionCache } from "@/types/collection";
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "OCRMetadata",
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      selectedCollection: null as number | null
    };
  },
  methods: {
    async addToCollection() {
      if (!this.selectedCollection) return;
      await this.axios.post(
        `/collections/attachment`,
        typeof this.items === "object"
          ? {
            items: this.items,
            collectionId: this.selectedCollection
          }
          : {
            attachmentId: this.items,
            collectionId: this.selectedCollection
          }
      );
      this.$toast.success("Added to collection");
      this.$emit("collectionAdded", {
        collection: this.$collections.write.find(
          (c: CollectionCache) => c.id === this.selectedCollection
        ),
        items: this.items
      });
      this.$emit("update:modelValue", false);
    },
    select(value: string) {
      if (this.selectedCollection) {
        this.addToCollection();
        return;
      }
      if (!value) return;
      const filter = this.$collections.write.filter((c: CollectionCache) =>
        c.name.toLowerCase().startsWith(value.toLowerCase())
      );
      if (filter.length === 1) {
        this.selectedCollection = filter[0].id;
        this.addToCollection();
      }
    }
  },
  watch: {
    modelValue() {
      this.selectedCollection = null;
    }
  }
});
</script>

<style scoped></style>
