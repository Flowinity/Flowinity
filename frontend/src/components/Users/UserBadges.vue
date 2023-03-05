<template>
  <v-chip-group :model-value="selected" disabled class="mt-n2">
    <!-- Permission badges -->
    <HoverChip
      v-ripple
      text="TPU Administrator"
      v-if="user.admin || user.administrator"
      icon="mdi-shield"
      color="#0190ea"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Moderator"
      v-if="user.moderator"
      icon="mdi-shield"
      color="success"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <!-- Plan/other badge -->
    <HoverChip
      v-ripple
      :text="'TPU ' + user.plan?.name"
      v-if="!user.plan?.internalName.includes('FREE')"
      :icon="user.plan?.icon"
      :color="user.plan?.color"
      text-color="black"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <!-- Rank tiers -->
    <HoverChip
      v-ripple
      text="TPU God"
      icon="mdi-crown"
      color="primary"
      :small="true"
      v-if="rank === 'god'"
      title="You're Better than the rest™."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Champion"
      icon="mdi-compass"
      color="gold"
      :small="true"
      v-if="rank === 'champion'"
      title="Champion deez nuts."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Legend"
      icon="mdi-chess-knight"
      color="purple"
      :small="true"
      v-if="rank === 'legend'"
      title="You're a legend."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Mediumist"
      icon="mdi-microsoft-xbox-controller-battery-medium"
      color="#1ac62b"
      :small="true"
      v-if="rank === 'medium'"
      title="You're medium."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Intermediate"
      icon="mdi-target-account"
      color="cyan"
      :small="true"
      v-if="rank === 'intermediate'"
      title="You're getting Better™."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Noob"
      icon="mdi-chess-pawn"
      color="grey"
      :small="true"
      v-if="rank === 'noob'"
      title="Noob. Get Better™."
      class="user-badge"
    ></HoverChip>
    <!-- God, #0190ea/primary -->
    <HoverChip
      v-ripple
      text="Chronic TPU Addiction Condition Disorder (CTPUACD)"
      icon="mdi-clock"
      color="#0190ea"
      :small="true"
      v-if="user.stats?.pulse >= 100"
      title="Have 100h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Chronic Screenshot Addiction Condition Disorder (CSACD)"
      icon="mdi-account-arrow-up"
      color="#0190ea"
      :small="true"
      v-if="user.stats?.uploads >= 100000"
      title="Upload 100K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Chronic Kollectivization Addiction Condition Disorder (CKACD)"
      icon="mdi-rhombus-split"
      color="#0190ea"
      :small="true"
      title="Have a collectivized to upload percentage of 100% or more."
      v-if="
        user.stats?.uploads >= 10000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.99
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Chronic Collection Addiction Condition Disorder (CCACD)"
      icon="mdi-folder-multiple-image"
      color="#0190ea"
      :small="true"
      v-if="user.stats?.collections >= 100"
      title="Have 100+ collections."
      class="user-badge"
    ></HoverChip>
    <!-- Champion, #ffd700/gold -->
    <HoverChip
      v-ripple
      text="Champion Uploader"
      icon="mdi-account-arrow-up"
      color="gold"
      :small="true"
      v-if="user.stats?.uploads >= 50000 && user.stats?.uploads < 100000"
      title="Upload 50K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU Addict"
      icon="mdi-clock"
      color="gold"
      :small="true"
      v-if="user.stats?.pulse >= 72 && user.stats?.pulse < 100"
      title="Have 69h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Champion Collectivist"
      icon="mdi-rhombus-split"
      color="gold"
      :small="true"
      title="Have a collectivized to upload percentage of 90% or more."
      v-if="
        user.stats?.uploads >= 10000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.9 &&
        user.stats?.collectionItems / user.stats?.uploads < 0.95
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Extreme kollection kreator"
      icon="mdi-folder-multiple-image"
      color="purple"
      :small="true"
      v-if="user.stats?.collections >= 25 && user.stats?.collections < 100"
      title="Have 25+ collections."
      class="user-badge"
    ></HoverChip>
    <!-- Legend tier, #673ab7/purple -->
    <HoverChip
      v-ripple
      text="Extreme Uploader"
      icon="mdi-account-arrow-up"
      color="purple"
      :small="true"
      v-if="user.stats?.uploads >= 10000 && user.stats?.uploads < 50000"
      title="Upload 10K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Nice Hours"
      icon="mdi-clock"
      color="purple"
      :small="true"
      v-if="user.stats?.pulse >= 69 && user.stats?.pulse < 72"
      title="Have 69h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="True Collectivist"
      icon="mdi-rhombus-split"
      color="purple"
      :small="true"
      title="Have a collectivized to upload percentage of 80% or more."
      v-if="
        user.stats?.uploads >= 1000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.8 &&
        (user.stats?.collectionItems / user.stats?.uploads < 0.9 ||
          user.stats?.uploads < 10000)
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Extreme kollection kreator"
      icon="mdi-folder-multiple-image"
      color="purple"
      :small="true"
      v-if="user.stats?.collections >= 20 && user.stats?.collections < 25"
      title="Have 20+ collections."
      class="user-badge"
    ></HoverChip>
    <!-- Mediumist tier, #1ac62b/Thomas lime -->
    <HoverChip
      v-ripple
      text="Pro Uploader"
      icon="mdi-upload"
      color="#1ac62b"
      :small="true"
      v-if="user.stats?.uploads >= 4154 && user.stats?.uploads < 10000"
      title="Upload 4154+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="TPU All Nighter"
      icon="mdi-clock-fast"
      color="#1ac62b"
      :small="true"
      v-if="user.stats?.pulse >= 24 && user.stats?.pulse < 69"
      title="Have 24h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Nice Collectivist"
      icon="mdi-rhombus-split"
      color="#1ac62b"
      :small="true"
      title="Have a collectivized to upload percentage of 69% or more."
      v-if="
        user.stats?.uploads >= 1000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.69 &&
        user.stats?.collectionItems / user.stats?.uploads < 0.8
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Pro kollection kreator"
      icon="mdi-folder-multiple-image"
      color="#1ac62b"
      :small="true"
      v-if="user.stats?.collections >= 15 && user.stats?.collections < 20"
      title="Have 15+ collections."
      class="user-badge"
    ></HoverChip>
    <!-- Mediumist, #00bcd4/cyan -->
    <HoverChip
      v-ripple
      text="Getting Better™"
      icon="mdi-upload"
      color="cyan"
      :small="true"
      v-if="user.stats?.uploads >= 1000 && user.stats?.uploads < 4154"
      title="Upload 1K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Better than Average"
      icon="mdi-clock"
      color="cyan"
      :small="true"
      v-if="user.stats?.pulse >= 12 && user.stats?.pulse < 24"
      title="Have 12h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Noob Collectivist"
      icon="mdi-rhombus-split"
      color="cyan"
      :small="true"
      title="Have a collectivized to upload percentage of 4.154% or more."
      v-if="
        user.stats?.uploads >= 1000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.4154 &&
        user.stats?.collectionItems / user.stats?.uploads < 0.69
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Better™ kollection kreator"
      icon="mdi-folder-multiple-image"
      color="cyan"
      :small="true"
      v-if="user.stats?.collections >= 10 && user.stats?.collections < 15"
      title="Have 10+ collections."
      class="user-badge"
    ></HoverChip>
    <!-- Noob, grey -->
    <HoverChip
      v-ripple
      text="Getting Started"
      icon="mdi-upload"
      color="grey"
      :small="true"
      v-if="user.stats?.uploads >= 500 && user.stats?.uploads < 1000"
      title="Upload 500+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Average User"
      icon="mdi-clock"
      color="grey"
      :small="true"
      v-if="user.stats?.pulse >= 8 && user.stats?.pulse < 12"
      title="Have 8h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Average kollection kreator"
      icon="mdi-folder-multiple-image"
      color="grey"
      :small="true"
      v-if="user.stats?.collections >= 5 && user.stats?.collections < 10"
      title="Have 5+ collections."
      class="user-badge"
    ></HoverChip>

    <!-- Other -->
    <HoverChip
      v-ripple
      :text="age + ' year old account'"
      :icon="'mdi-numeric-' + age"
      color="teal"
      :small="true"
      :title="`${user.username}'s account is ${age} years old.`"
      v-if="age >= 1"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Cake Week"
      icon="mdi-cake"
      color="pink lighten-2"
      :small="true"
      :title="`${user.username}'s account was created this week ${age} years ago.`"
      v-if="cakeWeek && age >= 1"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      v-for="badge in user.badges"
      :text="badge.name"
      :icon="badge.icon"
      :color="badge.color"
      :small="true"
      :title="badge.tooltip"
      :image="badge.image"
      class="user-badge"
      @click="handleClick(badge)"
    ></HoverChip>
    <HoverChip
      v-ripple
      v-if="user.noFriends"
      text="No friends :("
      title="Get Better ™ 😟"
      icon="mdi-account-multiple-remove"
      color="silver"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      v-ripple
      text="Not friends with user, some information may be unavailable."
      icon="mdi-account-off"
      color="grey"
      :small="true"
      v-if="
        !$friends.friends.find((f) => f.friendId === user.id) &&
        user.id !== $user.user?.id
      "
      class="user-badge"
    ></HoverChip>
  </v-chip-group>
</template>

<script lang="ts">
import HoverChip from "@/components/Core/HoverChip.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserBadges",
  methods: {
    crash() {
      throw "deez";
    },
    async handleClick(badge: any) {
      if (badge.name === ":skull:") {
        this.crash();
      } else if (badge.name === "Click me") {
        await this.axios.head("/user/getRekt");
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      }
    }
  },
  components: { HoverChip },
  props: ["user"],
  computed: {
    rank() {
      if (
        this.user.stats?.pulse >= 100 &&
        this.user.stats?.uploads >= 100000 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.99 &&
        this.user.stats?.collections >= 100
      ) {
        return "god";
      } else if (
        this.user.stats?.uploads >= 50000 &&
        this.user.stats?.pulse >= 72 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.9 &&
        this.user.stats?.collections >= 25
      ) {
        return "champion";
      } else if (
        this.user.stats?.uploads >= 10000 &&
        this.user.stats?.pulse >= 69 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.8 &&
        this.user.stats?.collections >= 20
      ) {
        return "legend";
      } else if (
        this.user.stats?.uploads >= 4154 &&
        this.user.stats?.pulse >= 24 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.69 &&
        this.user.stats?.collections >= 15
      ) {
        return "medium";
      } else if (
        this.user.stats?.uploads >= 1000 &&
        this.user.stats?.pulse >= 12 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.4154 &&
        this.user.stats?.collections >= 10
      ) {
        return "intermediate";
      } else if (
        this.user.stats?.uploads >= 500 &&
        this.user.stats?.pulse >= 8 &&
        this.user.collections?.length >= 5
      ) {
        return "noob";
      } else {
        return null;
      }
    },
    selected() {
      // select all of them
      return [...Array(100).keys()];
    },
    age() {
      if (!this.user?.createdAt) return 0;
      const years = this.$date().diff(this.user?.createdAt, "years");
      if (years > 9) {
        return 9;
      } else {
        return years;
      }
    },
    cakeWeek() {
      if (!this.user?.createdAt) return false;
      let date =
        this.$date().year() +
        "-" +
        this.$date(this.user.createdAt).format("MM-DD");
      return this.$date().isSame(this.$date(date), "week");
    }
  }
});
</script>

<style scoped>
.v-chip--disabled {
  opacity: 1 !important;
  pointer-events: inherit !important;
  user-select: inherit !important;
}
</style>
