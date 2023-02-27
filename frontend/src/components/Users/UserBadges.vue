<template>
  <v-card-title style="padding: 0 !important">
    <HoverChip
      text="TPU Administrator"
      v-if="user.admin || user.administrator"
      icon="mdi-shield"
      color="#0190ea"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="TPU Moderator"
      v-if="user.moderator"
      icon="mdi-shield"
      color="success"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      :text="'TPU ' + user.plan?.name"
      v-if="!user.plan?.internalName.includes('FREE')"
      :icon="user.plan?.icon"
      :color="user.plan?.color"
      text-color="black"
      :small="true"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Chronic Screenshot Addiction Condition Disorder (CSACD)"
      icon="mdi-account-arrow-up"
      color="#0190ea"
      :small="true"
      v-if="user.stats?.uploads >= 50000"
      title="Upload 50K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Extreme Uploader"
      icon="mdi-account-arrow-up"
      color="indigo"
      :small="true"
      v-else-if="user.stats?.uploads >= 10000"
      title="Upload 10K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Pro Uploader"
      icon="mdi-upload"
      color="deep-purple"
      :small="true"
      v-else-if="user.stats?.uploads >= 4154"
      title="Upload 4154+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Getting Better™"
      icon="mdi-upload"
      color="deep-orange"
      :small="true"
      v-else-if="user.stats?.uploads >= 1000"
      title="Upload 1K+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Getting Started"
      icon="mdi-upload"
      color="grey darken-3"
      :small="true"
      v-else-if="user.stats?.uploads >= 500"
      title="Upload 500+ items."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="TPU All Nighter"
      icon="mdi-clock-fast"
      color="cyan"
      :small="true"
      v-if="user.stats?.pulse >= 24"
      title="Have 24h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="TPU Addict"
      icon="mdi-clock"
      color="cyan"
      :small="true"
      v-else-if="user.stats?.pulse >= 12"
      title="Have 12h+ in TPU."
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="True Collectivist"
      icon="mdi-rhombus-split"
      color="cyan darken-3"
      :small="true"
      title="Have a collectivized to upload percentage of 80% or more."
      v-if="
        user.stats?.uploads >= 1000 &&
        user.stats?.collectionItems / user.stats?.uploads >= 0.8
      "
      class="user-badge"
    ></HoverChip>
    <HoverChip
      :text="age + ' year old account'"
      :icon="'mdi-numeric-' + age"
      color="teal"
      :small="true"
      :title="`${user.username}'s account is ${age} years old.`"
      v-if="age >= 1"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Cake Week"
      icon="mdi-cake"
      color="pink lighten-2"
      :small="true"
      :title="`${user.username}'s account was created this week ${age} years ago.`"
      v-if="cakeWeek && age >= 1"
      class="user-badge"
    ></HoverChip>
    <HoverChip
      text="Sans Enjoyer"
      color="grey"
      :small="true"
      title="uhuhuhuh sans"
      v-if="user.id === 10"
      class="user-badge"
      image="https://i.troplo.com/i/5516167987df.png"
    ></HoverChip>
    <HoverChip
      text="Ramen Enjoyer"
      color="#a60f00"
      :small="true"
      title="Genshin Enjoyer"
      v-if="user.id === 12"
      class="user-badge"
      image="https://i.troplo.com/i/984e5fff4c4e.png"
    ></HoverChip>
    <HoverChip
      text="TPU Developer"
      color="#ffd700"
      :small="true"
      title="Contributed to TPU."
      v-if="user.id === 6 || user.id === 1 || user.id === 2"
      class="user-badge"
      icon="mdi-code-tags"
    ></HoverChip>
    <HoverChip
      text="😟kull:"
      color="#ffd700"
      :small="true"
      :title="`:skull:`"
      @click="crash"
      v-if="user.id === 6 || user.id === 1"
      class="user-badge"
      icon="mdi-skull"
    ></HoverChip>
    <HoverChip
      text="TPU Deezer"
      color="#1AC62B"
      :small="true"
      :title="`Doin' deez`"
      v-if="user.id === 7 || user.id === 6"
      class="user-badge"
      icon="mdi-hamburger"
    ></HoverChip>
    <HoverChip
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
    <span v-if="user.id === 11 || user.id === 6 || user.id === 1">
      <v-img
        src="https://i.troplo.com/i/7b7a142db839.jpg"
        width="43"
        class="rounded-xl"
        style="display: inline-block; top: 6px"
        title=":skull:"
      ></v-img>
      <v-tooltip activator="parent" location="top">
        He was forced to deez
      </v-tooltip>
    </span>
  </v-card-title>
</template>

<script lang="ts">
import HoverChip from "@/components/Core/HoverChip.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserBadges",
  methods: {
    crash() {
      throw "deez";
    }
  },
  components: { HoverChip },
  props: ["user"],
  computed: {
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

<style scoped></style>
