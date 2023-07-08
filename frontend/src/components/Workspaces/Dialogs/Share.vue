<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Document Sharing</template>
    <v-card-text>
      <v-checkbox
        v-model="share"
        class="mt-n2 mb-n5 ml-n3"
        label="Share this document"
        @change="update"
      />
      Anyone can view this note if they have the link, but cannot edit it.
      <template v-if="share">
        This document can be viewed publicly from
        <a
          class="pointer"
          @click="
            $functions.copy(
              `https://${
                $user.user?.domain?.domain || $app.site.hostnameWithProtocol
              }/notes/${shareLink}`
            );
            $toast.info('Link copied to clipboard');
          "
        >
          {{
            "https://" + $user.user?.domain?.domain ||
            $app.site.hostnameWithProtocol
          }}/notes/{{ shareLink }}
        </a>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('update:modelValue', false)">Close</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "WorkspaceShareDialog",
  components: {CoreDialog},
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
      const {data} = await this.axios.patch(
        "/notes/" + this.$route.params.id + "/share"
      );
      this.shareLink = data.shareLink;
      this.share = data.shareLink !== null;
    }
  },
  async mounted() {
    const {data} = await this.axios.get("/notes/" + this.$route.params.id, {
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
