<template>
  <div v-if="user">
    <UserBanner :user="user"></UserBanner>
    <v-container class="mt-2">
      <v-row>
        <v-col lg="9" cols="12" md="12">
          <v-row no-gutters>
            <!-- only take up the size of the avatar -->
            <v-col sm="auto">
              <v-hover v-slot="{ hover }">
                <UserAvatar
                  :user="user"
                  :status="true"
                  :size="$vuetify.display.mobile ? 55 : 110"
                  class="mr-4"
                  :no-badges="true"
                  @refresh="getUser(false)"
                  :edit="user.id === $user.user?.id"
                >
                  <transition
                    appear
                    v-if="$user.user?.id === user.id"
                    name="fade-transition"
                    :duration="{ enter: 300, leave: 300 }"
                  >
                    <v-btn
                      icon
                      class="rounded-xl"
                      v-if="hover"
                      style="position: absolute; top: 10px; right: 10px"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </transition>
                </UserAvatar>
              </v-hover>
            </v-col>
            <v-col sm="auto">
              <v-card-text class="ml-n2 align-center">
                <h1 style="font-weight: 500">{{ user.username }}</h1>
                <UserBadges :user="user"></UserBadges>
              </v-card-text>
            </v-col>
            <v-spacer></v-spacer>
            <v-col sm="2">
              <v-card-text class="ml-n2 align-center">
                <v-btn
                  text
                  :color="friends.color"
                  shaped
                  v-if="friends"
                  @click="doFriendRequest"
                  :loading="friendLoading"
                >
                  <v-icon class="mr-2">
                    {{ friends.icon }}
                  </v-icon>
                  {{ friends.text }}</v-btn
                >
              </v-card-text>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
          <v-card-text class="text-overline"
            >About {{ user.username }}</v-card-text
          >
          <v-card-text
            class="mt-n8"
            style="overflow-wrap: break-word; white-space: pre-line"
          >
            {{ user.description }}
            <v-btn
              icon
              x-small
              class="grey--text"
              v-if="$user.user?.id === user.id"
              @click="settings.description.value = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-text>
          <template v-if="user.collections?.length">
            <v-divider></v-divider>
            <v-card-text class="text-overline">Mutual Collections</v-card-text>
            <v-card-text class="subtitle-1 mt-n7">
              <v-slide-group>
                <CollectionCard
                  style="width: 400px"
                  class="mr-4"
                  v-for="collection in user.collections"
                  :key="collection.id"
                  :item="
                    $collections.items.find((item) => item.id === collection.id)
                  "
                ></CollectionCard>
              </v-slide-group>
            </v-card-text>
          </template>
          <template v-if="user.friends?.length">
            <v-divider></v-divider>
            <v-card-text class="text-overline">Mutual Friends</v-card-text>
            <v-card-text class="subtitle-1 mt-n7">
              <v-slide-group>
                <v-card
                  :to="`/u/${friend.user.username}`"
                  class="rounded-xl pt-3 justify-center text-center px-2"
                  v-for="friend in user.friends"
                  :key="friend.id"
                  color="transparent"
                  elevation="0"
                >
                  <UserAvatar
                    :user="friend.user"
                    size="100"
                    class="ml-2 mr-2"
                  />
                  <v-card-title class="text-center justify-center">
                    {{ friend.user.username }}
                  </v-card-title>
                </v-card>
              </v-slide-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-overline">Statistics</v-card-text>
            <v-row> </v-row>
          </template>
        </v-col>
        <v-col md="3" cols="12" sm="12">
          <StatsCard
            title="Creation date"
            :value="$date(user.createdAt).format('DD/MM/YYYY')"
            class="my-3"
          ></StatsCard>
          <StatsCard
            title="Uploads"
            :value="user.stats.uploads.toLocaleString()"
            class="my-3"
          ></StatsCard>
          <StatsCard
            title="Collections"
            :value="user.stats.collections.toLocaleString()"
            class="my-3"
          ></StatsCard>
          <StatsCard
            title="Collectivizations"
            :value="user.stats.collectionItems.toLocaleString()"
            class="my-3"
          ></StatsCard>
          <StatsCard
            title="TPU Hours"
            :value="user.stats.pulse.toLocaleString()"
            class="my-3"
          ></StatsCard>
          <StatsCard
            title="Workspace Docs"
            :value="user.stats.docs"
            class="my-3"
          ></StatsCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import { User } from "@/models/user";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import StatsCard from "@/components/Dashboard/StatsCard.vue";

export default defineComponent({
  name: "User",
  components: {
    StatsCard,
    CollectionCard,
    CollectionBanner,
    UserBadges,
    UserAvatar,
    UserBanner
  },
  data() {
    return {
      user: undefined as User | undefined,
      friendLoading: false,
      settings: {
        description: {
          value: false,
          loading: false
        }
      }
    };
  },
  computed: {
    friends() {
      if (this.user?.friend === "accepted") {
        return {
          text: "Remove Friend",
          color: "red",
          icon: "mdi-account-minus"
        };
      } else if (this.user?.friend === "outgoing") {
        return {
          text: "Cancel Request",
          color: "grey",
          icon: "mdi-account-minus"
        };
      } else if (this.user?.friend === "incoming") {
        return {
          text: "Accept Request",
          color: "green",
          icon: "mdi-account-plus"
        };
      } else {
        return {
          text: "Add Friend",
          color: "green",
          icon: "mdi-account-plus"
        };
      }
    }
  },
  methods: {
    async doFriendRequest() {
      this.friendLoading = true;
      await this.axios.post(`/user/friends/${this.user?.id}`);
      this.friendLoading = false;
      this.getUser(false);
    },
    async getUser(load = true) {
      if (load) {
        this.$app.componentLoading = true;
      }
      const { data } = await this.axios.get(
        `/user/profile/${this.$route.params.username}`
      );
      this.user = data;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    this.getUser();
  },
  watch: {
    "$route.params.username"() {
      this.getUser();
    }
  }
});
</script>

<style scoped>
@media (min-width: 1600px) {
  .v-container {
    max-width: 80%;
  }
}
</style>
