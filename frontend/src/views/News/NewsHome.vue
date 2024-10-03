<template>
  <template v-if="appStore.site?.officialInstance">
    <v-container max-width="1400">
      <template v-if="!news?.items">
        <v-skeleton-loader
          :loading="true"
          class="rounded-xl mb-4"
          aspect-ratio="16/9"
          v-for="i in 5"
          :key="i"
          type="article"
        />
      </template>

      <div v-else class="d-flex flex-column" style="gap: 12px">
        <v-text-field
          v-model="search"
          label="Search"
          outlined
          dense
          append-inner-icon="mdi-magnify"
          class="rounded-xl"
          @keydown.enter="refresh"
          @click:append-inner="refresh"
        />
        <v-card
          v-for="announcement in news.items"
          :key="announcement.id"
          class="rounded-xl"
        >
          <div :class="{ 'd-flex': !display.mobile.value }">
            <v-img
              :src="announcement.image"
              aspect-ratio="16/9"
              max-width="400"
              min-width="400"
              cover
            />
            <div class="d-flex flex-column justify-center flex-0">
              <v-card-title class="text-h4 text-wrap">
                {{ announcement.title }}
              </v-card-title>
              <v-card-subtitle>
                {{
                  dayjs(announcement.createdAt).format(
                    "hh:mm A, Do of MMMM YYYY"
                  )
                }}
              </v-card-subtitle>
              <v-card-text>
                {{ announcement.description }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :to="`/news/${announcement.id}`"
                  variant="outlined"
                  class="ml-2"
                >
                  Read more
                </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
        <div
          v-if="!news.items?.length"
          class="text-h4 text-center d-flex flex-column justify-center align-center"
        >
          <v-icon size="48">mdi-information</v-icon>
          <span>There are no posts right now.</span>
          <v-card-subtitle>
            Check back later for the latest updates and announcements.
          </v-card-subtitle>
        </div>
        <v-pagination
          v-if="news.pager.totalPages > 1"
          v-model="page"
          :length="news.pager.totalPages"
        />
      </div>
    </v-container>
    <teleport
      to="#appbar-options"
      v-if="
        uiStore.ready &&
        (userStore.user?.administrator || userStore.user?.moderator)
      "
    >
      <accessible-transition mode="out-in" name="slide-up" appear>
        <div class="flex gap-2">
          <v-btn
            icon
            size="small"
            href="https://troplo.com/admin/announcements/new"
            target="_blank"
          >
            <RiAddLine />
            <v-tooltip location="bottom" activator="parent">
              Create post on Troplo.com
            </v-tooltip>
          </v-btn>
        </div>
      </accessible-transition>
    </teleport>
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAnnouncementsStore } from "@/store/announcements.store";
import dayjs from "@/plugins/dayjs";
import { useDisplay } from "vuetify";
import { AnnouncementsQuery } from "@/troploservices-gql/graphql";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import { RiAddLine } from "@remixicon/vue";
import { useAppStore } from "@/store/app.store";

const announcementsStore = useAnnouncementsStore();
const page = ref(1);
const search = ref("");
const display = useDisplay();
const news = ref<AnnouncementsQuery["announcements"]>();
const userStore = useUserStore();
const uiStore = useProgressiveUIStore();
const appStore = useAppStore();

onMounted(async () => {
  news.value = await announcementsStore.getAnnouncements({
    page: page.value,
    search: search.value
  });
});

async function refresh() {
  news.value = await announcementsStore.getAnnouncements({
    page: page.value,
    search: search.value
  });
}
</script>

<style scoped></style>
