<template>
  <tpu-dialog v-model="dialog" width="500">
    <div class="p-3">
      <strong>Args:</strong>
      <br />
      <text-field
        :model-value="args"
        :textarea="true"
        :readonly="true"
        :max-lines="10"
      />
      <strong>Result:</strong>
      <br />
      <text-field
        :model-value="result"
        :max-lines="10"
        :textarea="true"
        :readonly="true"
      />
    </div>
  </tpu-dialog>
  <div class="flex flex-col gap-4">
    <tpu-expansion-panel v-model:expanded="settings.graphqlActions">
      <template #header>GraphQL Actions</template>
      <sidebar-debug-graph-q-l-actions />
    </tpu-expansion-panel>
    <tpu-expansion-panel v-model:expanded="settings.graphql">
      <template #header>GraphQL</template>
      <sidebar-debug-graph-q-l />
    </tpu-expansion-panel>
    <tpu-expansion-panel v-model:expanded="settings.websocket">
      <template #header>Legacy Gateway</template>

      <div>
        <tpu-list>
          <tpu-list-item
            v-for="socket in Object.entries(sockets)"
            :key="socket[0]"
          >
            <div>{{ socket[0] }} - {{ socketConnected[socket[0]] }}</div>
          </tpu-list-item>
        </tpu-list>
      </div>
    </tpu-expansion-panel>
    <tpu-expansion-panel
      v-model:expanded="settings.comms"
      v-if="chatStore.selectedChat"
    >
      <template #header>Comms</template>

      <sidebar-debug-comms />
    </tpu-expansion-panel>
  </div>
</template>

<script setup lang="ts">
import TpuExpansionPanel from "@/components/Framework/ExpansionPanel/TpuExpansionPanel.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { onMounted, provide, ref, watch } from "vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { useSocket } from "@/boot/socket.service";
import { useChatStore } from "@/stores/chat.store";
import SidebarDebugComms from "@/components/Sidebar/Debug/SidebarDebugComms.vue";
import SidebarDebugGraphQL from "@/components/Sidebar/Debug/SidebarDebugGraphQL.vue";
import SidebarDebugGraphQLActions from "@/components/Sidebar/Debug/SidebarDebugGraphQLActions.vue";

const args = ref<any>({});
const dialog = ref(false);
const result = ref<any>({});

export type DebugSettings = {
  graphql: boolean;
  websocket: boolean;
  gqlExclPulse: boolean;
  comms: boolean;
  graphqlActions: boolean;
};

const settings = ref({
  graphql: false,
  websocket: false,
  gqlExclPulse: true,
  comms: false,
  graphqlActions: false
});
const sockets = useSocket;
const socketConnected = ref<Record<string, boolean>>({});
const chatStore = useChatStore();

setTimeout(() => {
  for (const socket of Object.entries(sockets)) {
    socketConnected.value[socket[0]] = socket[1].connected;
  }
}, 1000);

watch(
  () => [
    settings.value.graphql,
    settings.value.websocket,
    settings.value.gqlExclPulse,
    settings.value.comms,
    settings.value.graphqlActions
  ],
  () => {
    localStorage.setItem("debug", JSON.stringify(settings.value));
  }
);

onMounted(() => {
  const debug = localStorage.getItem("debug");
  if (debug) {
    settings.value = JSON.parse(debug);
  }
});

provide("settings", settings);
</script>

<style scoped></style>
