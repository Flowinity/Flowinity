<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card color="card">
      <v-toolbar>
        <v-toolbar-title>Create Collection</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
          required
          autofocus
          @keydown.enter="createCollection"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="createCollection"
          :loading="loading"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CreateCollectionDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      name: "",
      loading: false
    };
  },
  methods: {
    async createCollection() {
      this.loading = true;
      const { data } = await this.axios.post("/collections", {
        name: this.name
      });
      await this.$collections.init();
      this.$emit("update:modelValue", false);
      this.loading = false;
      this.$router.push(`/collections/${data.id}`);
    }
  }
});
</script>

<style scoped></style>
