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
    <tpu-expansion-panel v-model:expanded="settings.graphql">
      <template #header>GraphQL</template>
      <div>
        <tpu-switch
          v-model="settings.gqlExclPulse"
          label="Excl. Pulse"
        ></tpu-switch>
        <tpu-list>
          <tpu-list-item
            v-for="operation in settings.gqlExclPulse
              ? debugStore.recentOperations.filter(
                  (o) => !o.name.includes('Pulse')
                )
              : debugStore.recentOperations"
            :key="operation.id"
          >
            <div>
              {{ operation.name }}
              <div class="flex gap-2">
                <tpu-button
                  :color="
                    operation.type === 'mutation'
                      ? 'green'
                      : operation.type === 'query'
                        ? 'blue'
                        : 'yellow'
                  "
                  :no-ripple="true"
                  style="font-size: 8px"
                  class="flex items-center"
                >
                  {{ operation.type?.toUpperCase().slice(0, 3) }}
                </tpu-button>
                <tpu-button
                  :color="
                    Math.round(operation.time) > 500
                      ? 'red'
                      : Math.round(operation.time) > 300
                        ? 'yellow'
                        : 'green'
                  "
                  :no-ripple="true"
                  style="font-size: 14px"
                  class="flex items-center"
                >
                  <template v-if="!operation.pending">
                    {{ Math.round(operation.time) }}
                  </template>
                  <template v-else>
                    <tpu-spinner
                      style="width: 20px; height: 22px"
                      color="green"
                    />
                  </template>
                </tpu-button>
                <tpu-button
                  v-tooltip.top="'Arguments'"
                  @click="
                    args = JSON.stringify(operation.args, null, 2);
                    result = JSON.stringify(operation.result, null, 2);
                    dialog = true;
                  "
                  style="font-size: 14px"
                  class="flex items-center"
                >
                  <ri-information-line style="width: 20px" />
                </tpu-button>
              </div>
            </div>
          </tpu-list-item>
        </tpu-list>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import TpuExpansionPanel from "@/components/Framework/ExpansionPanel/TpuExpansionPanel.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useDebugStore } from "@/stores/debug.store";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiInformationLine from "vue-remix-icons/icons/ri-information-line.vue";
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { onMounted, ref, watch } from "vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { useSocket } from "@/boot/socket.service";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";

const apollo = useApolloClient();
const debugStore = useDebugStore();
const args = ref<any>({});
const dialog = ref(false);
const result = ref<any>({});
const settings = ref({
  graphql: false,
  websocket: false,
  gqlExclPulse: true
});
const sockets = useSocket;
const socketConnected = ref<Record<string, boolean>>({});

setTimeout(() => {
  for (const socket of Object.entries(sockets)) {
    socketConnected.value[socket[0]] = socket[1].connected;
  }
}, 1000);

watch(
  () => [
    settings.value.graphql,
    settings.value.websocket,
    settings.value.gqlExclPulse
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
</script>

<style scoped></style>
