<template>
  <card outlined padding>
    <template #header>Flowinity Statistics</template>
    <div
      v-if="appStore.state?.stats"
      class="grid 2xl:grid-cols-4 sm:grid-cols-3 gap-4 mt-4"
    >
      <card :secondary="false" class="text-center" padding>
        <template #header>Uploads</template>
        <p class="mt-2 text-4xl">
          {{ appStore.state.stats.uploads.toLocaleString() }}
        </p>
      </card>
      <card :secondary="false" class="text-center" padding>
        <template #header>Users</template>
        <p class="mt-2 text-4xl">
          {{ appStore.state.stats.users.toLocaleString() }}
        </p>
      </card>
      <card :secondary="false" class="text-center" padding>
        <template #header>Messages</template>
        <p class="mt-2 text-4xl">
          {{ appStore.state.stats.messages.toLocaleString() }}
        </p>
      </card>
      <card :secondary="false" class="text-center" padding>
        <template #header>Time Spent</template>
        <p class="mt-2 text-4xl">
          {{ appStore.state.stats.pulse.toLocaleString() }}h
        </p>
      </card>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";

const appStore = useAppStore();
const userStore = useUserStore();
</script>

<style scoped></style>
