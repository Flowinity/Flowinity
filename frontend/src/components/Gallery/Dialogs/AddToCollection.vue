<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Add to collection</template>
    <v-card-text>
      <v-autocomplete
        v-model="selectedCollection"
        :items="$collections.write"
        :autofocus="true"
        item-title="name"
        item-value="id"
        label="Select collection"
        outlined
        @keydown.enter="select($event.target.value)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="addToCollection">Add</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { CollectionCache } from "@/types/collection";
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue", "items"],
  emits: ["update:modelValue", "collectionAdded"],
  data() {
    return {
      selectedCollection: null as number | null
    };
  },
  watch: {
    modelValue() {
      this.selectedCollection = null;
    }
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
  }
});
</script>
