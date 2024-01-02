<template>
  <DevDialog @close="$app.dialogs.memoryProfiler = false">
    <template #header>Memory Profiler (CTRL + ALT + M)</template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Memory Usage by Store</v-card-title>
            <v-btn @click="memoryUsageByStore()">Refresh</v-btn>
            <v-card-text>
              <v-data-table
                :headers="[
                  { title: 'Store', key: 'name' },
                  { title: 'Size', key: 'size' }
                ]"
                :hide-default-footer="true"
                :items="usage"
                :sort-by="[{ key: 'size', order: 'desc' }]"
              >
                <template #[`item.size`]="{ item }">
                  {{ $functions.fileSize(item.size) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useFriendsStore } from "@/store/friends.store";
import { useCollectionsStore } from "@/store/collections.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";

export default defineComponent({
  components: { DevDialog },
  data() {
    return {
      usage: []
    };
  },
  methods: {
    getCircularReplacer() {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    },
    memoryUsageByStore() {
      this.usage = [
        {
          name: "ChatStore",
          size: JSON.stringify(useChatStore(), this.getCircularReplacer())
            .length
        },
        {
          name: "UserStore",
          size: JSON.stringify(useUserStore(), this.getCircularReplacer())
            .length
        },
        {
          name: "ExperimentsStore",
          size: JSON.stringify(
            useExperimentsStore(),
            this.getCircularReplacer()
          ).length
        },
        {
          name: "AppStore",
          size: JSON.stringify(useAppStore(), this.getCircularReplacer()).length
        },
        {
          name: "FriendsStore",
          size: JSON.stringify(useFriendsStore(), this.getCircularReplacer())
            .length
        },
        {
          name: "CollectionsStore",
          size: JSON.stringify(
            useCollectionsStore(),
            this.getCircularReplacer()
          ).length
        },
        {
          name: "WorkspacesStore",
          size: JSON.stringify(useWorkspacesStore(), this.getCircularReplacer())
            .length
        }
      ];
    }
  }
});
</script>
