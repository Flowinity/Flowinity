<template>
  <Banner :announcement="announcement" />
  <NewsItem :announcement="announcement" />
</template>

<script setup lang="ts">
import { useRoute, useAsyncData } from "#app"
import { useApolloClient } from "@vue/apollo-composable"
import { AnnouncementDocument, type AnnouncementQuery } from "@/gql/graphql"
import dayjs from "@/lib/dayjs"
import mdAnnouncements from "@/lib/mdAnnouncements"
import { useDisplay } from "vuetify"
import Banner from "~/components/Announcements/Banner.vue"
import NewsItem from "~/components/Announcements/NewsItem.vue"

// Get the current route
const route = useRoute()
const id = ref<string>(route.params.id as string)
const apollo = useApolloClient()
const display = useDisplay()

// Fetch announcement data using asyncData for SSR support
const { data: announcement } = await useAsyncData(
  `announcement-${id.value}`,
  async () =>
    apollo.client
      .query({
        query: AnnouncementDocument,
        variables: { announcementId: id.value }
      })
      .then((res) => res.data.announcement as AnnouncementQuery["announcement"])
)

useHead({
  title: `${announcement.value?.title || "Announcement"} - Troplo.com`,
  meta: [
    {
      name: "description",
      content:
        announcement.value?.description || "An update from TroploServices."
    },
    {
      property: "og:title",
      content: `${announcement.value?.title || "Announcement"} - Troplo.com`
    },
    { property: "og:image", content: announcement.value?.image || "" },
    {
      property: "og:description",
      content:
        announcement.value?.description || "An update from TroploServices."
    },
    {
      property: "twitter:card",
      content: "summary_large_image"
    },
    {
      property: "twitter:image",
      content: announcement.value?.image || ""
    }
  ]
})
</script>

<style scoped></style>
