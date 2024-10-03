<template>
  <v-container max-width="1400">
    <div v-if="announcement">
      <div>
        <v-card-title class="text-h4 text-wrap text-center">
          {{ announcement.title }}
          <v-chip v-if="announcement.draft">Draft</v-chip>
        </v-card-title>
        <div
          class="d-flex justify-center"
          :class="{
            'flex-column': display.mobile.value && display.width.value
          }"
        >
          <a
            :href="`https://flowinity.com/u/${announcement.flowinityUser?.username}`"
            class="text-decoration-none d-flex flex-column align-center"
            style="color: inherit"
          >
            <v-avatar size="40">
              <v-img
                v-if="announcement.flowinityUser?.avatar"
                :src="announcement.flowinityUser.avatar"
                :alt="announcement.flowinityUser.username"
              />
            </v-avatar>
            <span class="v-card-subtitle">
              {{ announcement.flowinityUser?.username }}
            </span>
          </a>
          <div class="ml-4">
            <p class="v-card-subtitle text-wrap">
              Published at
              {{
                dayjs(announcement.createdAt).format("hh:mm A, Do of MMMM YYYY")
              }}
              <small
                v-if="
                  announcement.bannerExpiry &&
                  dayjs(announcement.bannerExpiry).isAfter(dayjs())
                "
              >
                (Expires {{ dayjs(announcement.bannerExpiry).fromNow() }})
              </small>
              <small v-else-if="announcement.bannerExpiry" class="text-red">
                (Expired {{ dayjs(announcement.bannerExpiry).fromNow() }})
              </small>
            </p>
            <v-divider class="my-2" />
            <p
              v-if="announcement.content"
              :key="announcement.content"
              v-html="mdAnnouncements.render(announcement.content)"
              class="text-break"
            ></p>
          </div>
        </div>
      </div>
    </div>
    <v-skeleton-loader
      v-else
      :loading="true"
      class="mx-auto"
      height="100%"
      type="article"
    />
  </v-container>
</template>

<script setup lang="ts">
import mdAnnouncements from "@/plugins/rulesEmail";
import type {
  Announcement,
  AnnouncementQuery
} from "@/troploservices-gql/graphql";
import dayjs from "@/plugins/dayjs";
import { useDisplay } from "vuetify";

const display = useDisplay();

defineProps<{
  announcement:
    | Announcement
    | null
    | undefined
    | AnnouncementQuery["announcement"];
}>();
</script>

<style scoped></style>
