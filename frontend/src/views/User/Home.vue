<template>
  <v-container>
    <v-row v-if="users.length">
      <v-col v-for="user in users" :key="user.id" cols="12" md="2" sm="6">
        <v-card class="rounded-xl" elevation="7">
          <v-container class="justify-center align-center">
            <div class="justify-center align-center text-center">
              <router-link
                :to="'/u/' + user.username"
                style="text-decoration: none"
                class="align-center justify-center"
              >
                <UserAvatar :user="user" :size="70" />
              </router-link>
            </div>
            <v-card-title class="text-center">
              <router-link
                style="text-decoration: none; color: unset"
                :to="'/u/' + user.username"
              >
                {{ user.username }}
              </router-link>
            </v-card-title>
            <div class="text-subtitle-1 text-center justify-center limit">
              {{ user.description }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <PromoNoContent
      v-else-if="!$app.componentLoading"
      icon="mdi-connection"
      title="You may be offline!"
      description="Please check your internet connection, or the TPU servers may be currently unavailable."
    ></PromoNoContent>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "UserHome",
  components: { UserAvatar, PromoNoContent },
  data() {
    return {
      users: []
    };
  },
  methods: {
    async getUsers() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/user/all");
      this.users = data;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    this.getUsers();
  }
});
</script>

<style scoped></style>
