<template>
  <v-card color="toolbar lighten-2 p-4" :to="example.route">
    <div>
      <div class="text-grey">
        <v-icon>{{ example.heading.icon }}</v-icon>
        <span class="ml-2">{{ example.heading.title }}</span>
      </div>
    </div>
    <div class="text-h6">Continue where you left off.</div>
    <div class="flex flex-col">
      <div class="flex">
        <UserAvatar
          :user="{
            avatar: example.content.icon,
            username: example.content.title
          }"
        />
        <div class="ml-4 text-h5">{{ example.content.title }}</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import UserAvatar from "@/components/Users/UserAvatar.vue";

const example = {
  route: "/communications/-1",
  heading: {
    icon: "mdi-message-processing",
    title: "Communications"
  },
  content: {
    title: "Jolt707",
    icon: "3459781d.png"
  },
  id: -1
};
</script>

<style scoped></style>
