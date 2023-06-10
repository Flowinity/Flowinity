<template>
  <v-card class="text-center justify-center">
    <v-container>
      <strong class="text-gradient" style="font-size: 24px">
        {{ $t("dashboard.announcements") }}
      </strong>
      <v-card
        v-for="announcement in announcements"
        :color="$vuetify.theme.global.name === 'amoled' ? undefined : 'toolbar'"
        :variant="
          $vuetify.theme.global.name === 'amoled' ? 'outlined' : undefined
        "
        class="my-3 pt-3 hover"
        elevation="0"
        :key="announcement.id"
      >
        <UserAvatar
          :user="announcement.user"
          size="58"
          style="cursor: pointer"
          @click="$router.push(`/u/${announcement.user.username}`)"
        ></UserAvatar>
        <v-card-title
          style="cursor: pointer"
          @click="$router.push(`/u/${announcement.user.username}`)"
        >
          {{ announcement.user.username }}
        </v-card-title>
        <v-card-text>
          <p class="mb-1 mt-n1">{{ announcement.content }}</p>
          <small>
            {{
              $date(announcement.createdAt).format("Do of MMMM YYYY, h:mm A")
            }}
          </small>
        </v-card-text>
      </v-card>
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "AnnouncementsWidget",
  components: { UserAvatar },
  data() {
    return {
      page: 1,
      demo: [
        {
          id: 1,
          userId: 1,
          content: "Welcome to TroploPrivateUploader.",
          type: null,
          createdAt: "2023-01-21T15:36:45.000Z",
          updatedAt: "2023-01-21T15:36:45.000Z",
          user: {
            id: 1,
            username: "Troplo",
            avatar: "3c0926363bc9.png",
            moderator: false,
            administrator: true
          }
        }
      ]
    };
  },
  computed: {
    announcements() {
      // limit 3 per page, get pages
      const announcements = this.$app.demo
        ? this.demo
        : this.$app.site.announcements;
      return announcements.slice((this.page - 1) * 3, this.page * 3);
    },
    pages() {
      const announcements = this.$app.demo
        ? this.demo
        : this.$app.site.announcements;
      return Math.ceil(announcements.length / 3);
    }
  }
});
</script>

<style scoped>
.hover {
  background: transparent !important;
}

.hover:hover {
  background: rgba(0, 0, 0, 0.1) !important;
}
</style>
