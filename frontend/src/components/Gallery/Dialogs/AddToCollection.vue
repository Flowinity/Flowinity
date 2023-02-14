<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title> Add to collection </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-autocomplete
            v-model="selectedCollection"
            item-title="name"
            item-value="id"
            :items="$collections.write"
            label="Select collection"
            outlined
            autofocus
            @keydown.enter="select($event.target.value)"
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('update:modelValue', false)"
          >Cancel</v-btn
        >
        <v-btn color="primary" @click="addToCollection">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CollectionCache } from "@/types/collection";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AddToCollection",
  props: ["modelValue", "items"],
  emits: ["update:modelValue", "collectionAdded"],
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
