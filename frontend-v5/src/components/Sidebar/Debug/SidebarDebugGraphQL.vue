<template>
  <div>
    <tpu-switch
      v-model="settings.gqlExclPulse"
      label="Excl. Pulse"
    ></tpu-switch>
    <text-field v-model="operationsSearch" label="Search" />
    <tpu-list>
      <tpu-list-item v-for="operation in operations" :key="operation.id">
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
                <tpu-spinner style="width: 20px; height: 22px" color="green" />
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
    <tpu-pager v-model="operationsPage" :pages="operationsPages" />
  </div>
</template>

<script setup lang="ts">
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiInformationLine from "vue-remix-icons/icons/ri-information-line.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import TpuPager from "@/components/Framework/Pager/TpuPager.vue";
import { computed, inject, Ref, ref } from "vue";
import { DebugSettings } from "@/components/Sidebar/SidebarDebug.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useDebugStore } from "@/stores/debug.store";
const settings = inject<Ref<DebugSettings>>("settings")!;

const apollo = useApolloClient();
const debugStore = useDebugStore();

const operationsSearch = ref("");
const operationsPage = ref(1);
const itemsPerPage = 10;
const operations = computed(() => {
  const ops = debugStore.recentOperations.filter((op) =>
    op.name.toLowerCase().includes(operationsSearch.value.toLowerCase())
  );
  if (settings.value.gqlExclPulse) {
    return ops.filter((op) => !op.name.includes("Pulse"));
  }
  return ops.slice(
    (operationsPage.value - 1) * itemsPerPage,
    operationsPage.value * itemsPerPage
  );
});

const operationsPages = computed(() => {
  return Math.ceil(operations.value.length / 10);
});
</script>

<style scoped></style>
