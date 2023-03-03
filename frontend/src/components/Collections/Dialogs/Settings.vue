<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
  >
    <v-card color="card" v-if="collection">
      <v-toolbar>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="collection.name"
          label="Name"
          required
          autofocus
        ></v-text-field>
        <v-btn class="ml-n4" @click="removeBanner" text color="red">
          Remove Banner
        </v-btn>
      </v-card-text>
      <v-card-actions class="mt-2">
        <v-btn
          color="red"
          text
          @click="deleteCollection"
          v-if="collection.userId === $user.user?.id"
        >
          Delete Collection
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="updateSettings">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Collection } from "@/models/collection";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CollectionSettings",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    collection: {
      type: Object as () => Collection
    }
  },
  emits: ["update:modelValue", "refreshCollection"],
  methods: {
    async updateSettings() {
      await this.axios.patch(`/collections/${this.collection?.id}`, {
        name: this.collection?.name
      });
      this.$toast.success("Collection settings updated.");
      this.$emit("update:modelValue", false);
    },
    async deleteCollection() {
      await this.axios.delete(`/collections/${this.collection?.id}`);
      this.$router.push("/collections");
      this.$collections.init();
    },
    async removeBanner() {
      await this.axios.delete(`/collections/${this.collection?.id}/banner`);
      this.$emit("refreshCollection");
    }
  }
});
</script>

<style scoped></style>
