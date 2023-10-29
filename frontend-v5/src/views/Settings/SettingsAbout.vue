<template>
  <card padding class="my-4 mx-4">
    <div class="flex flex-col items-center justify-center align-middle">
      <div class="items-center flex justify-center">
        <img
          src="@/assets/flowinity-header.svg"
          style="max-width: 500px"
          draggable="false"
        />
      </div>
      <tpu-divider class="w-full py-2" />
      <p>
        Product name:
        <strong>TPUv5 (Flowinity)</strong>
      </p>
      <p>
        Version:
        <strong>{{ appStore.versioning.current }}</strong>
      </p>
      <p>
        Build Date:
        <strong>
          {{ dayjs(appStore.versioning.date).format("DD/MM/YYYY hh:mm:ss A") }}
        </strong>
      </p>
      <p>
        Relative Build Date:
        <strong>{{ dayjs(appStore.versioning.date).fromNow() }}</strong>
      </p>
      <p>
        Server:
        <strong>{{ appStore.state?.server }}</strong>
      </p>
      <p class="mt-4">
        <strong>Flowinity</strong>
        by TroploServices.
      </p>
      <small>Formerly TPU/PrivateUploader.</small>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import TpuDivider from "@/components/Framework/Divider/TpuDivider.vue";
import { useAppStore } from "@/stores/app.store";
import dayjs from "dayjs";

const appStore = useAppStore();
</script>

<style scoped></style>
