<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Create Collection</template>
    <v-card-text>
      <v-text-field
        v-model="name"
        :autofocus="true"
        label="Name"
        required
        @keydown.enter="createCollection"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn :loading="loading" color="blue darken-1" @click="createCollection">
        Create
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "CreateCollectionDialog",
  components: { CoreDialog },
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
      await this.$app.init();
      this.$emit("update:modelValue", false);
      this.loading = false;
      this.$router.push(`/collections/${data.id}`);
    }
  }
});
</script>
