<template>
  <card outlined padding>
    <template #header>At a Glance</template>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <card :secondary="false" padding>
        <div class="flex justify-between px-4">
          <div>
            <strong>
              {{ appStore.weather.data.location || `${t("generic.loading")}...` }}
            </strong>
            <p class="mt-2 md:text-1xl lg:text-4xl">
              {{ appStore.weatherTemp
              }}{{
                userStore.user?.weatherUnit.charAt(0).toUpperCase() === "K"
                  ? ""
                  : "°"
              }}{{ userStore.user?.weatherUnit &&
            (userStore.user?.weatherUnit.charAt(0).toUpperCase() === "K" ?
                t("home.widgets.atAGlance.weather.temperatureUnits.kelvin") :
                userStore.user?.weatherUnit.charAt(0).toUpperCase() === "C" ?
                    t("home.widgets.atAGlance.weather.temperatureUnits.celsius") :
                    userStore.user?.weatherUnit.charAt(0).toUpperCase() === "F" ?
                        t("home.widgets.atAGlance.weather.temperatureUnits.fahrenheit") :
                        t("home.widgets.atAGlance.weather.temperatureUnits.unknown"))
            || t("home.widgets.atAGlance.weather.temperatureUnits.unknown")
              }}
            </p>
          </div>
          <img src="@/assets/icons/weather.svg" draggable="false"  alt="Weather"/>
        </div>
      </card>
      <card :secondary="false" padding>
        <template #header>{{ t("home.widgets.atAGlance.todo.title") }}</template>
      </card>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const appStore = useAppStore();
</script>

<style scoped></style>
