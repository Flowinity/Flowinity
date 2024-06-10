<template>
  <v-container v-if="$user.user">
    <div class="flex w-full">
      <v-card color="toolbar" class="w-full p-2">
        <v-card-title>Continue where you left off.</v-card-title>
        <v-slide-group :show-arrows="false">
          <ContinueLastContext
            v-for="item in recent"
            :item="item"
            class="mx-1"
          />
        </v-slide-group>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import ContinueLastContext from "@/components/Dashboard/Progressive/ContinueLastContext.vue";
import { computed, ComputedRef } from "vue";
import {
  NavigationOption,
  useProgressiveUIStore
} from "@/store/progressive.store";

const uiStore = useProgressiveUIStore();

const recent: ComputedRef<NavigationOption[]> = computed(() => {
  const recent: NavigationOption[] = [];
  for (const [key, value] of Object.entries(uiStore.lastRailRoutes)) {
    const item = uiStore.navigation.options[key]?.find(
      (item) => item.path === value
    );
    console.log(item, key, value);
    if (!item) continue;
    recent.push({
      ...item,
      rail: uiStore.navigation.railOptions[key]
    });
  }

  return recent;
});
</script>
