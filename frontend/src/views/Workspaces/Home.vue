<template>
  <v-container v-if="!$workspaces.items.length">
    <PromoNoContent
      title="Workspaces"
      icon="mdi-folder-account-outline"
    ></PromoNoContent>
    <v-row class="mt-2">
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon size="120" color="#606060" class="mt-2 mb-n3">
            mdi-note-outline
          </v-icon>
          <v-card-title class="justify-center text-center">
            <h3 style="opacity: 0.7">Documents</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Documents within workspaces allow you to easily write down notes,
              and other information which automatically sync to your TPU account
              and can be accessed anywhere.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon size="120" color="#606060" class="mt-2 mb-n3">
            mdi-account-group-outline
          </v-icon>
          <v-card-title class="justify-center text-center">
            <h3 style="opacity: 0.7">
              Collaboration
              <v-chip small class="ml-2" style="opacity: 0.7">Soon™</v-chip>
            </h3>
          </v-card-title>
          <v-card-text>
            <p>
              Multiple TPU users can be in a workspace which allows for easy
              collaboration between one or more documents at a time.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon size="120" color="#606060" class="mt-2 mb-n3">
            mdi-lock-outline
          </v-icon>
          <v-card-title class="justify-center text-center">
            <h3 style="opacity: 0.7">Fine-grained access controls.</h3>
          </v-card-title>
          <v-card-text>
            <p>
              With the addition of scoped passwords or alternate passwords, you
              can set a unique password which permits access to workspaces, and
              disallow access to the rest of your TPU account for extra security
              on public or untrusted computers or networks.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <h3>Recent Notes</h3>
    <v-row class="mt-1">
      <v-col cols="12" sm="3" v-for="note in $workspaces.recent" :key="note.id">
        <v-card :to="`/workspaces/notes/${note.id}`">
          <v-card-text class="text-overline">
            {{ note.folder?.workspace?.name || "Unknown" }} &bullet; Document
          </v-card-text>
          <v-card-title class="mt-n6" style="font-size: 18px">
            {{ note.name }}
          </v-card-title>
          <v-card-subtitle class="mb-4 mt-n1">
            Last modified: {{ $date(note.updatedAt).fromNow() }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";

export default defineComponent({
  name: "Home",
  components: { PromoNoContent },
  methods: {
    async getRecent() {
      if (!this.$workspaces.recent.length) {
        this.$app.componentLoading = true;
      }
      await this.$workspaces.getRecent();
      this.$app.componentLoading = false;
    }
  },
  computed: {
    items() {
      return this.$workspaces.items;
    }
  },
  mounted() {
    if (!this.$vuetify.display.mobile) this.$app.workspaceDrawer = true;
    this.$app.title = "Workspaces";
    this.getRecent();
  }
});
</script>

<style scoped></style>
