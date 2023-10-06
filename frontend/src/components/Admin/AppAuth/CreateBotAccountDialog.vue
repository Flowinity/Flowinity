<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    max-height="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      <v-toolbar-title>Create bot account</v-toolbar-title>
    </template>
    <v-card-text>
      <v-form class="d-flex flex-column">
        <v-text-field
          v-model="username"
          label="Username"
          outlined
          dense
          required
          :rules="[
            (v) => !!v || 'Username is required',
            (v) => v.length <= 32 || 'Username must be less than 32 characters'
          ]"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('update:modelValue', false)">Cancel</v-btn>
      <v-btn color="primary" @click="createBot" :loading="loading">
        Create
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { CreateBotAccountMutation } from "@/graphql/developer/createApp.graphql";

export default defineComponent({
  name: "CreateBotAccountDialog",
  components: { CoreDialog },
  props: {
    modelValue: Boolean,
    id: String
  },
  emits: ["update:modelValue", "refresh"],
  data() {
    return {
      username: "",
      loading: false
    };
  },
  methods: {
    async createBot() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: CreateBotAccountMutation,
          variables: {
            input: {
              username: this.username,
              id: this.id
            }
          }
        });
        this.$emit("update:modelValue", false);
        this.$emit("refresh");
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped></style>
