<template>
  <div>
    <div class="flex gap-2">
      <tpu-button @click="wsClient?.terminate()">Disconnect WS</tpu-button>
      <tpu-button>Connect WS</tpu-button>
    </div>
    WS State: {{ wsClient?.status }}
  </div>
</template>

<script setup lang="ts">
import { useApolloClient } from "@vue/apollo-composable";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { inject } from "vue";
import { Client } from "graphql-ws";

const apollo = useApolloClient();

const wsClient = inject<Client>("wsClient");
</script>

<style scoped></style>
