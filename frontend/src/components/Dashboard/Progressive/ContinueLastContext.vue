<template>
  <v-card color="toolbar lighten-2" class="p-4" :elevation="0" :to="item.path">
    <div>
      <div class="text-grey flex items-center">
        <component :is="item.rail.icon" />
        <span class="ml-4">{{ item.rail.name }}</span>
      </div>
    </div>
    <div class="flex flex-col mt-2">
      <div class="flex items-center">
        <component :is="item.icon" />
        <div class="ml-4 text-h5">{{ item.name }}</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { NavigationOption } from "@/store/progressive.store";

const props = defineProps({
  item: {
    type: Object as () => NavigationOption,
    required: true
  }
});
</script>

<style scoped></style>
