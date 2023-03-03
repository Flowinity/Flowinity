<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" sm="12">
        <v-text-field
          v-model="search"
          label="Search"
          placeholder="Search for a user"
          @keydown.enter="getUsers"
          append-inner-icon="mdi-magnify"
          @click:append-inner="getUsers"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-select
          v-model="sortVal"
          :items="sortOptions"
          label="Sort by"
          @change="getUsers"
          item-value="value"
          item-title="text"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="user in users" :key="user.id" cols="12" md="3" sm="6">
        <v-card class="rounded-xl" elevation="7" height="215">
          <v-container class="justify-center align-center">
            <div class="justify-center align-center text-center">
              <router-link
                :to="'/u/' + user.username"
                style="text-decoration: none"
              >
                <UserAvatar
                  :user="user"
                  :size="80"
                  :status="true"
                  :status-y-offset="25"
                  :status-x-offset="10"
                  :no-badges="true"
                />
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
            <UserBadges :user="user" class="text-center mt-n1 mb-2" />
            <div class="ml-n1 text-center justify-center limit">
              {{ user.description }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <Paginate
      class="mt-4"
      v-model="page"
      :total-pages="pagination.totalPages"
      :per-page="20"
      v-if="users.length"
    />
    <PromoNoContent
      v-if="!$app.componentLoading && !users.length"
      icon="mdi-magnify"
      title="No users found"
      description="Try searching for something else."
    ></PromoNoContent>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { User } from "@/models/user";
import UserBadges from "@/components/Users/UserBadges.vue";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "UserHome",
  components: { Paginate, UserBadges, UserAvatar, PromoNoContent },
  data() {
    return {
      users: [] as User[],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        pageSize: 20,
        currentPage: 1
      },
      sort: "id",
      order: "desc",
      search: "",
      page: 1,
      sortOptions: [
        {
          text: "Newest users",
          value: "id desc"
        },
        {
          text: "Oldest users",
          value: "id asc"
        },
        {
          text: "Username (A-Z)",
          value: "username asc"
        },
        {
          text: "Username (Z-A)",
          value: "username desc"
        }
      ]
    };
  },
  computed: {
    sortVal: {
      get() {
        return this.sort + " " + this.order;
      },
      set(val: string) {
        const [sort, order] = val.split(" ");
        this.sort = sort;
        this.order = order;
        this.getUsers();
      }
    }
  },
  methods: {
    async getUsers() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/user/all", {
        params: {
          sort: this.sort,
          order: this.order,
          search: this.search,
          page: this.page
        }
      });
      this.users = data.users;
      this.pagination = data.pager;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    this.$app.title = "Users";
    this.getUsers();
  },
  watch: {
    page() {
      this.getUsers();
    }
  }
});
</script>

<style scoped></style>
