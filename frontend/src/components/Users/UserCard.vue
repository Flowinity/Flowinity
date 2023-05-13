<template>
  <v-card :to="`/u/${username}`" class="my-2 user-card">
    <UserBanner :user="user" :height="120">
      <div class="d-flex" style="align-items: center; height: 120px">
        <UserAvatar :size="80" :user="user" class="ml-4"></UserAvatar>
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
import { User } from "@/models/user";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "UserCard",
  components: { UserAvatar, UserBanner },
  props: ["username", "subtitle"],
  data() {
    return {
      user: null as User | null
    };
  },
  methods: {
    async getUser() {
      const { data } = await this.axios.get(`/user/profile/${this.username}`);
      this.user = data;
    }
  },
  mounted() {
    this.getUser();
  }
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
