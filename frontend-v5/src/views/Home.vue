<template>
  <container>
    <div class="flex text-2xl justify-between mb-4">
      <p>
        Welcome back,
        <strong>{{ userStore.user?.username }}.</strong>
      </p>
      <div class="gap-2 flex">
        <tpu-button
          v-tooltip.top="t('home.locked')"
          icon
          @click="locked = !locked"
        >
          <ri-lock-line v-if="!locked" style="width: 20px" />
          <ri-lock-unlock-line
            v-else
            style="width: 20px"
            class="text-red-500"
          />
        </tpu-button>
        <tpu-button v-tooltip.top="t('generic.reset')" icon>
          <ri-refresh-line style="width: 20px" />
        </tpu-button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-4">
        <home-widget-handler
          v-for="widget in col1"
          :key="widget.id"
          :widget="widget"
          :locked="locked"
        />
        <card outlined class="mt-4">
          <div class="justify-center flex fill-medium-emphasis-dark">
            <RiAddLine class="w-20" />
          </div>
        </card>
      </div>
      <div class="flex flex-col gap-4">
        <home-widget-handler
          v-for="widget in col2"
          :key="widget.id"
          :widget="widget"
          :locked="locked"
        />
        <card outlined class="mt-4">
          <div class="justify-center flex fill-medium-emphasis-dark">
            <RiAddLine class="w-20" />
          </div>
        </card>
      </div>
    </div>
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
import HomeWidgetHandler from "@/components/Home/Widgets/HomeWidgetHandler.vue";
import RiRefreshLine from "vue-remix-icons/icons/ri-refresh-line.vue";
import { useI18n } from "vue-i18n";
import RiLockLine from "vue-remix-icons/icons/ri-lock-line.vue";
import RiLockUnlockLine from "vue-remix-icons/icons/ri-lock-unlock-line.vue";
import { computed, provide, ref } from "vue";

const userStore = useUserStore();
const appStore = useAppStore();
const { t } = useI18n();

const _locked = ref(localStorage.getItem("homeWidgetsLocked") === "true");
const locked = computed({
  get: () => {
    return _locked.value;
  },
  set: (value: boolean) => {
    console.log(value);
    _locked.value = value;
    localStorage.setItem("homeWidgetsLocked", value.toString());
  }
});
provide("locked", locked);

const flatWidgets = computed(() => {
  return userStore.user?.homeWidgets?.rows.map((row) => row.widgets).flat();
});

const col1 = computed(() => {
  return flatWidgets.value?.filter((widget, index) => index % 2 === 0);
});

const col2 = computed(() => {
  return flatWidgets.value?.filter((widget, index) => index % 2 === 1);
});
</script>

<style scoped>
.masonry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  grid-auto-rows: minmax(100px, 200px);
  grid-auto-flow: dense;
}
</style>
