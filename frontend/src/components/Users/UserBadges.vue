<template>
  <div>
    <HoverChip
      text="TPU Administrator"
      v-if="user.admin || user.administrator"
      icon="mdi-shield"
      color="#0190ea"
      :small="true"
    ></HoverChip>
    <HoverChip
      text="TPU Moderator"
      v-if="user.moderator"
      icon="mdi-shield"
      color="success"
      :small="true"
    ></HoverChip>
    <HoverChip
      :text="'TPU ' + user.plan?.name"
      v-if="user.plan?.internalName !== 'FREE'"
      :icon="user.plan?.icon"
      :color="user.plan?.color"
      text-color="black"
      :small="true"
    ></HoverChip>
    <HoverChip
      text="Chronic Screenshot Addiction Condition Disorder (CSACD)"
      icon="mdi-account-arrow-up"
      color="#0190ea"
      :small="true"
      v-if="user.stats?.uploads >= 50000"
      title="Upload 50K+ items."
    ></HoverChip>
    <HoverChip
      text="Extreme Uploader"
      icon="mdi-account-arrow-up"
      color="indigo"
      :small="true"
      v-else-if="user.stats?.uploads >= 10000"
      title="Upload 10K+ items."
    ></HoverChip>
    <HoverChip
      text="Pro Uploader"
      icon="mdi-upload"
      color="deep-purple"
      :small="true"
      v-else-if="user.stats?.uploads >= 4154"
      title="Upload 4154+ items."
    ></HoverChip>
    <HoverChip
      text="Getting Better™"
      icon="mdi-upload"
      color="deep-orange"
      :small="true"
      v-else-if="user.stats?.uploads >= 1000"
      title="Upload 1K+ items."
    ></HoverChip>
    <HoverChip
      text="Getting Started"
      icon="mdi-upload"
      color="grey darken-3"
      :small="true"
      v-else-if="user.stats?.uploads >= 500"
      title="Upload 500+ items."
    ></HoverChip>
    <HoverChip
      text="TPU All Nighter"
      icon="mdi-clock-fast"
      color="cyan"
      :small="true"
      v-if="user.stats?.pulse >= 24"
      title="Have 24h+ in TPU."
    ></HoverChip>
    <HoverChip
      text="TPU Addict"
      icon="mdi-clock"
      color="cyan"
      :small="true"
      v-else-if="user.stats?.pulse >= 12"
      title="Have 12h+ in TPU."
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
    ></HoverChip>
    <HoverChip
      :text="'year old account'"
      :icon="'mdi-numeric-' + age"
      color="teal"
      :small="true"
      :title="`${user.username}'s account is ${age} years old.`"
      v-if="age >= 1"
    ></HoverChip>
    <HoverChip
      text="Cake Week"
      icon="mdi-cake"
      color="pink lighten-2"
      :small="true"
      :title="`${user.username}'s account was created this week ${age} years ago.`"
      v-if="cakeWeek && age >= 1"
    ></HoverChip>
  </div>
</template>

<script>
import HoverChip from "@/components/Core/HoverChip.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "UserBadges",
  components: { HoverChip },
  props: ["user"],
  computed: {
    age() {
      if (!this.user?.createdAt) return 0
      const years = this.$date().diff(this.user?.createdAt, "years")
      if (years > 9) {
        return 9
      } else {
        return years
      }
    },
    cakeWeek() {
      if (!this.user?.createdAt) return false
      let date =
        this.$date().year() +
        "-" +
        this.$date(this.user.createdAt).format("MM-DD")
      return this.$date().isSame(this.$date(date), "week")
    }
  }
})
</script>

<style scoped></style>
