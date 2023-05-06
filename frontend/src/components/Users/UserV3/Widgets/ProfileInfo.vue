<template>
  <v-card-text class="text-overline">About {{ user.username }}</v-card-text>
  <v-card-text
    class="mt-n7"
    style="overflow-wrap: break-word; white-space: pre-line"
    v-if="!settings.description.value"
  >
    {{ user.description }}
    <v-btn
      icon
      size="x-small"
      class="grey--text"
      v-if="$user.user?.id === user.id"
      @click="settings.description.value = true"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </v-card-text>
  <v-card-text
    class="mt-n7"
    style="overflow-wrap: break-word; white-space: pre-line"
    v-else
  >
    <v-textarea
      v-model="$user.changes.description"
      outlined
      autofocus
      @keydown.esc="settings.description.value = false"
      dense
      auto-grow
      :rows="1"
      :counter="255"
      @keydown.exact.ctrl.enter="save"
    ></v-textarea>
    <v-card-actions class="mt-n4">
      <v-spacer></v-spacer>
      <v-btn
        @click="save"
        color="primary"
        :loading="settings.description.loading"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProfileInfo",
  props: ["user"],
  data: () => ({
    settings: {
      description: {
        value: false,
        loading: false
      }
    }
  }),
  methods: {
    async save() {
      this.settings.description.loading = true;
      await this.$user.save();
      if (this.user) this.user.description = this.$user.user?.description;
      this.settings.description.value = false;
      this.settings.description.loading = false;
    }
  }
});
</script>

<style scoped></style>
