import { defineStore } from "pinia";
import {
  AnnouncementsDocument,
  type AnnouncementsInput,
  type AnnouncementsQuery
} from "@/troploservices-gql/graphql";
import { nextTick, onMounted, ref, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useDisplay } from "vuetify";

export const useAnnouncementsStore = defineStore("announcements", () => {
  const banners = ref<AnnouncementsQuery["announcements"]["items"]>([]);
  const announcements = ref<AnnouncementsQuery["announcements"]["items"]>([]);
  const apolloClient = useApolloClient("troploservices");

  async function getAnnouncements(
    input: AnnouncementsInput = {}
  ): Promise<AnnouncementsQuery["announcements"]> {
    const { data } = await apolloClient.client.query({
      query: AnnouncementsDocument,
      variables: { input },
      fetchPolicy: "network-only"
    });
    return data.announcements;
  }

  const navbarOffset = ref(64);
  const display = useDisplay();

  watch(
    () => [banners.value, display.width.value, display.height.value],
    async () => {
      await nextTick(() => {
        let offset = 64;
        for (const banner of banners.value) {
          const element = document.getElementById(`banner-${banner.id}`);
          if (element) {
            offset += element.clientHeight;
          }
        }
        navbarOffset.value = offset;
      });
    }
  );

  onMounted(() => {
    getAnnouncements({
      page: 1,
      banner: false
    }).then((a) => {
      console.log("Announcements", a);
      announcements.value = a.items;
    });
  });

  return {
    banners,
    getAnnouncements,
    navbarOffset,
    announcements
  };
});
