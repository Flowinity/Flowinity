<template>
  <DevDialog>
    <template v-slot:header>Memory Profiler (CTRL + ALT + M)</template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Memory Usage by Store</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="[
                  { title: 'Store', key: 'name' },
                  { title: 'Size', key: 'size' }
                ]"
                :hide-default-footer="true"
                :items="memoryUsageByStore"
                :sort-by="[{ key: 'size', order: 'desc' }]"
              >
                <template v-slot:item.size="{ item }">
                  {{ $functions.fileSize(item.raw.size) }}
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
import {defineComponent} from "vue";
import {useAppStore} from "@/store/app";
import {useUserStore} from "@/store/user";
import {useChatStore} from "@/store/chat";
import {useExperimentsStore} from "@/store/experiments";
import {useFriendsStore} from "@/store/friends";
import {useCollectionsStore} from "@/store/collections";
import {useWorkspacesStore} from "@/store/workspaces";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";

export default defineComponent({
  name: "MemoryProfiler",
  components: {DevDialog},
  data() {
    return {
      usage: []
    };
  },
  computed: {
    memoryUsageByStore() {
      return [
        {
          name: "ChatStore",
          size: JSON.stringify(useChatStore()).length
        },
        {
          name: "UserStore",
          size: JSON.stringify(useUserStore()).length
        },
        {
          name: "ExperimentsStore",
          size: JSON.stringify(useExperimentsStore()).length
        },
        {
          name: "AppStore",
          size: JSON.stringify(useAppStore()).length
        },
        {
          name: "FriendsStore",
          size: JSON.stringify(useFriendsStore()).length
        },
        {
          name: "CollectionsStore",
          size: JSON.stringify(useCollectionsStore()).length
        },
        {
          name: "WorkspacesStore",
          size: JSON.stringify(useWorkspacesStore()).length
        }
      ];
    }
  }
});
</script>
