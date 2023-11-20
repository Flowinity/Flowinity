<template>
  <v-card :to="`/u/${username}`" class="my-2 user-card">
    <UserBanner :height="120" :user="user">
      <div class="d-flex" style="align-items: center; height: 120px">
        <UserAvatar :size="80" :user="user" class="ml-4" />
        <v-card-title>
          <h3>{{ user?.username }}</h3>
          <v-card-subtitle v-if="subtitle" style="padding-left: 0">
            {{ subtitle }}
          </v-card-subtitle>
        </v-card-title>
      </div>
    </UserBanner>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "UserCard",
  components: { UserAvatar, UserBanner },
  props: ["username", "subtitle", "user"]
});
</script>

<style>
.user-card #user-header > img {
  filter: brightness(0.6) blur(3px);
}

.user-card #user-header > div.v-responsive__content > svg {
  filter: brightness(0.6) blur(3px);
}
</style>
