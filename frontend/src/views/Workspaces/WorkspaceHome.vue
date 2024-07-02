<template>
  <v-container v-if="!$workspaces.items.length">
    <PromoNoContent icon="mdi-folder-account-outline" title="Workspaces" />
    <v-row class="mt-2">
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon class="mt-2 mb-n3" size="120">mdi-note-outline</v-icon>
          <v-card-title class="justify-center text-center">
            <h3>Documents</h3>
          </v-card-title>
          <v-card-text>
            <p>
              Documents within workspaces allow you to easily write down notes,
              and other information which automatically sync to your
              {{ $app.site.name }} account and can be accessed anywhere.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon class="mt-2 mb-n3" size="120">
            mdi-account-group-outline
          </v-icon>
          <v-card-title class="justify-center text-center">
            <h3>
              Collaboration
              <v-chip class="ml-2" small>Soon™</v-chip>
            </h3>
          </v-card-title>
          <v-card-text>
            <p>
              Multiple {{ $app.site.name }} users can be in a workspace which
              allows for easy collaboration between one or more documents at a
              time.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="text-center">
          <v-icon class="mt-2 mb-n3" size="120">mdi-lock-outline</v-icon>
          <v-card-title class="justify-center text-center">
            <h3>Fine-grained access controls.</h3>
          </v-card-title>
          <v-card-text>
            <p>
              With the addition of scoped passwords or alternate passwords, you
              can set a unique password which permits access to workspaces, and
              disallow access to the rest of your {{ $app.site.name }} account
              for extra security on public or untrusted computers or networks.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <h3>Recent</h3>
    <v-row class="mt-1">
      <v-col
        v-for="note in $workspaces.recentOverall"
        :key="note.id"
        cols="12"
        sm="3"
      >
        <v-card :to="`/workspaces/notes/${note.id}`">
          <v-card-text class="text-overline">
            {{ note.folder.name || "Unknown" }} &bullet; Document
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
    <template v-for="item in $workspaces.recent" :key="item.id">
      <h3 class="mt-2">{{ item.name }}</h3>
      <v-row class="mt-1">
        <v-col
          v-for="note in workspaceNotes(item)"
          :key="note.id"
          cols="12"
          sm="3"
        >
          <v-card :to="`/workspaces/notes/${note.id}`">
            <v-card-text class="text-overline">
              {{ note.folder.name || "Unknown" }} &bullet; Document
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
    </template>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import { Workspace } from "@/models/workspace";

export default defineComponent({
  components: { PromoNoContent },
  computed: {
    items() {
      return this.$workspaces.items;
    }
  },
  mounted() {
    if (!this.$app.workspaceDrawer && !this.$vuetify.display.mobile) {
      this.$app.forcedWorkspaceDrawer = true;
      this.$app.workspaceDrawer = true;
    }
    this.$app.title = "Workspaces";
    this.getRecent();
  },
  unmounted() {
    this.$app.workspaceDrawer =
      localStorage.getItem("workspaceDrawer") === "true";
    this.$app.forcedWorkspaceDrawer = false;
  },
  methods: {
    workspaceNotes(workspace: Workspace) {
      return workspace.folders.map((folder) => folder.notes).flat();
    },
    async getRecent() {
      if (!this.$workspaces.recent.length) {
        this.$app.componentLoading = true;
      }
      await this.$workspaces.getRecent();
      this.$app.componentLoading = false;
    }
  }
});
</script>
