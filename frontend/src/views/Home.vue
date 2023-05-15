<template>
  <v-container v-if="$user.user">
    <v-row>
      <v-col md="6">
        <UserWidget />
        <AnnouncementsWidget class="mt-6" />
      </v-col>
      <v-col md="6">
        <StatsWidget />
        <GraphWidget :gold="$user.gold" :user="true" class="mt-6" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import UserAvatar from "@/components/Users/UserAvatar.vue"
import UserBadges from "@/components/Users/UserBadges.vue"
import UserWidget from "@/components/Dashboard/UserWidget.vue"
import StatsWidget from "@/components/Dashboard/StatsWidget.vue"
import AnnouncementsWidget from "@/components/Dashboard/AnnouncementsWidget.vue"
import GraphWidget from "@/components/Dashboard/GraphWidget.vue"

export default defineComponent({
  name: "Home",
  components: {
    GraphWidget,
    AnnouncementsWidget,
    StatsWidget,
    UserWidget,
    UserBadges,
    UserAvatar
  },
  mounted() {
    this.$app.title = "Dashboard"
  }
})
</script>
