<template>
  <v-card-text class="text-overline">About {{ user.username }}</v-card-text>
  <v-card-text
    v-if="!settings.description.value"
    class="mt-n7"
    style="overflow-wrap: break-word; white-space: pre-line"
  >
    {{ user.description }}
    <v-btn
      v-if="$user.user?.id === user.id"
      class="grey--text"
      icon
      size="x-small"
      @click="settings.description.value = true"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </v-card-text>
  <v-card-text
    v-else
    class="mt-n7"
    style="overflow-wrap: break-word; white-space: pre-line"
  >
    <v-textarea
      v-model="$user.changes.description"
      :counter="255"
      :rows="1"
      auto-grow
      autofocus
      dense
      outlined
      @keydown.esc="settings.description.value = false"
      @keydown.exact.ctrl.enter="save"
    ></v-textarea>
    <v-card-actions class="mt-n4">
      <v-spacer></v-spacer>
      <v-btn
        :loading="settings.description.loading"
        color="primary"
        @click="save"
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
