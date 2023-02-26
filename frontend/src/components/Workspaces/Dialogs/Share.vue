<template>
  <v-dialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Document Sharing</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-checkbox
          @change="update"
          v-model="share"
          label="Share this document"
          class="mt-n2 mb-n5 ml-n3"
        />
        Anyone can view this note if they have the link, but cannot edit it.
        <template v-if="share">
          This document can be viewed publicly from
          <a target="_blank" :href="'/notes/' + shareLink">
            {{ $app.site.hostnameWithProtocol }}/notes/{{ shareLink }}
          </a>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "WorkspaceShareDialog",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      share: false,
      shareLink: "",
      loading: false
    };
  },
  methods: {
    async update() {
      const { data } = await this.axios.patch(
        "/notes/" + this.$route.params.id + "/share"
      );
      this.shareLink = data.shareLink;
      this.share = data.shareLink !== null;
    }
  },
  async mounted() {
    const { data } = await this.axios.get("/notes/" + this.$route.params.id, {
      headers: {
        noToast: true
      }
    });
    this.shareLink = data.shareLink;
    this.share = data.shareLink !== null;
  }
});
</script>

<style scoped></style>
