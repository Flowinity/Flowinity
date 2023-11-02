<template>
  <container>
    <div class="flex text-3xl justify-between">
      <p>
        Welcome back,
        <strong>{{ userStore.user?.username }}.</strong>
      </p>
      <tpu-button>
        <RiPencilLine style="width: 20px" />
      </tpu-button>
    </div>
    <div class="grid grid-flow-col grid-cols-2 gap-4 mt-4">
      <card outlined padding>
        <template #header>At a Glance</template>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <card :secondary="false" padding>
            <div class="flex justify-between px-4">
              <div>
                <strong>
                  {{ appStore.weather.data.location || "Loading..." }}
                </strong>
                <p class="mt-2 text-4xl">
                  {{ appStore.weatherTemp
                  }}{{
                    userStore.user?.weatherUnit.charAt(0).toUpperCase() === "K"
                      ? ""
                      : "°"
                  }}{{ userStore.user?.weatherUnit.charAt(0).toUpperCase() }}
                </p>
              </div>
              <img src="@/assets/icons/weather.svg" />
            </div>
          </card>
          <card :secondary="false" padding>
            <template #header>todo</template>
          </card>
        </div>
      </card>
      <card outlined padding>
        <template #header>Flowinity Statistics</template>
        <div
          class="grid 2xl:grid-cols-4 sm:grid-cols-3 gap-4 mt-4"
          v-if="appStore.state?.stats"
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
    </div>
    <card outlined class="mt-4">
      <div class="justify-center flex fill-medium-emphasis-dark">
        <RiAddLine class="w-20" />
      </div>
    </card>
  </container>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import Container from "@/components/Framework/Container/Container.vue";
import { useUserStore } from "@/stores/user.store";
import RiPencilLine from "vue-remix-icons/icons/ri-pencil-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useAppStore } from "@/stores/app.store";

const userStore = useUserStore();
const appStore = useAppStore();
</script>

<style scoped></style>
