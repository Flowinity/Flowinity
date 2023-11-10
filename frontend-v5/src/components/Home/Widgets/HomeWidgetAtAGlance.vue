<template>
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
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";

const userStore = useUserStore();
const appStore = useAppStore();
</script>

<style scoped></style>
