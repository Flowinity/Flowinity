<template>
  <v-card class="text-center justify-center">
    <v-container>
      <strong style="font-size: 24px" class="text-gradient">
        Announcements
      </strong>
      <v-card
        v-for="announcement in announcements"
        class="my-3 pt-3"
        color="toolbar"
      >
        <UserAvatar
          size="58"
          :user="announcement.user"
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
      page: 1
    };
  },
  computed: {
    announcements() {
      // limit 3 per page, get pages
      return this.$app.site.announcements.slice(
        (this.page - 1) * 3,
        this.page * 3
      );
    },
    pages() {
      return Math.ceil(this.$app.site.announcements.length / 3);
    }
  }
});
</script>

<style scoped></style>
