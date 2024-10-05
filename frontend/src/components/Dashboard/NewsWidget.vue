<template>
  <DynamicCard
    v-if="item"
    :title="item.title"
    :secondary-text="item.description"
    :image="item.image"
    :to="`/news/${item.id}`"
  >
    <template #subtitle>
      <div class="align-center d-inline-flex">
        Read more
        <v-icon class="ml-2">mdi-arrow-right</v-icon>
      </div>
    </template>
    <template #right-text v-if="!$vuetify.display.mobile">
      <div class="d-inline-flex align-center">
        <RiNewsLine class="mr-2" size="20" />
        {{ $date(item.createdAt).format("Do of MMMM YYYY") }}
      </div>
    </template>
  </DynamicCard>
</template>

<script lang="ts" setup>
import DynamicCard from "@/components/Core/DynamicCard.vue";
import { useAnnouncementsStore } from "@/store/announcements.store";
import { computed } from "vue";
import { RiNewsLine } from "@remixicon/vue";

const announcementsStore = useAnnouncementsStore();
const item = computed(() => announcementsStore.announcements[0]);
</script>

<style scoped></style>
