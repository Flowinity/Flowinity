<template>
  <card padding>
    <template #header>Announcements</template>
    <div class="mt-4 flex-col flex gap-4">
      <card
        v-for="announcement in announcements"
        :key="announcement.id"
        outlined
        padding
      >
        <div class="flex flex-col items-center justify-center">
          <user-avatar
            :size="58"
            :src="appStore.domain + announcement.user?.avatar"
            v-if="announcement.user?.avatar"
          />
          <div class="my-2 text-xl">
            <strong>
              {{ announcement.user?.username || "Flowinity Staff" }}
            </strong>
          </div>
        </div>

        <div class="flex justify-between w-full">
          <div class="text-center w-full">
            <div v-html="functions.markdownEmail(announcement.content)"></div>
            <p class="mt-2 text-sm">
              {{
                dayjs(announcement.createdAt)
                  .locale("en")
                  .format("Do MMMM YYYY [at] HH:mm A")
              }}
            </p>
          </div>
        </div>
      </card>

      <tpu-pager
        v-model="page"
        :total-pages="Math.ceil(appStore.state?.announcements?.length / 3)"
      />
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import dayjs from "../../../plugins/dayjs";
import functions from "@/plugins/functions";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { computed, ref } from "vue";
import TpuPager from "@/components/Framework/Pager/TpuPager.vue";

const appStore = useAppStore();

const page = ref(1);

const announcements = computed(() => {
  return appStore.state?.announcements?.slice(
    (page.value - 1) * 3,
    page.value * 3
  );
});
</script>

<style scoped></style>
