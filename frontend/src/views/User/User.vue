<template>
  <div v-if="user">
    <UserBanner
      :user="user"
      :height="username ? 250 : undefined"
      @refreshUser="getUser(false)"
    ></UserBanner>
    <v-container class="mt-2" :style="username ? 'max-width: 100%;' : ''">
      <v-row>
        <v-col :lg="!username ? 9 : 12" cols="12" md="12">
          <v-row no-gutters>
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
            <v-col sm="100%" class="d-flex align-center">
              <v-card-text class="ml-n2">
                <div>
                  <h1 style="font-weight: 500" :class="username ? 'mb-2' : ''">
                    {{ user.username }}
                  </h1>
                  <UserBadges :user="user"></UserBadges>
                </div>
              </v-card-text>
            </v-col>
            <v-col
              class="d-flex align-center"
              sm="auto"
              style="justify-content: flex-end"
            >
              <v-card-text>
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
                  {{ friends.text }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  shaped
                  v-if="
                    user?.friend === 'accepted' &&
                    $experiments.experiments['COMMUNICATIONS']
                  "
                  @click="chat"
                  class="ml-2"
                  :loading="friendLoading"
                >
                  <v-icon class="mr-2">mdi-message-processing</v-icon>
                  Message
                </v-btn>
              </v-card-text>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
          <v-card-text class="text-overline">
            About {{ user.username }}
          </v-card-text>
          <v-card-text
            class="mt-n7"
            style="overflow-wrap: break-word; white-space: pre-line"
            v-if="!settings.description.value"
          >
            {{ user.description }}
            <v-btn
              icon
              size="x-small"
              class="grey--text"
              v-if="$user.user?.id === user.id"
              @click="settings.description.value = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-text
            class="mt-n7"
            style="overflow-wrap: break-word; white-space: pre-line"
            v-else
          >
            <v-textarea
              v-model="$user.changes.description"
              outlined
              dense
              auto-grow
              :rows="1"
              :counter="255"
              @keydown.exact.ctrl.enter="save"
            ></v-textarea>
            <v-card-actions class="mt-n4">
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="save"
                color="primary"
                :loading="settings.description.loading"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card-text>
          <template
            v-if="user.collections?.length && $collections.items.length"
          >
            <v-divider></v-divider>
            <v-card-text class="text-overline">Mutual Collections</v-card-text>
            <v-card-text class="subtitle-1 mt-n6">
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
            <v-card-text class="subtitle-1 mt-n6">
              <v-slide-group>
                <v-card
                  :to="!username ? `/u/${friend.user.username}` : undefined"
                  @click="
                    username
                      ? ($chat.dialogs.user.username = friend.user.username)
                      : null
                  "
                  class="rounded-xl pt-3 justify-center text-center px-2"
                  v-for="friend in user.friends"
                  :key="friend.id"
                  color="transparent"
                  elevation="0"
                >
                  <UserAvatar
                    :user="friend.user"
                    size="100"
                    :status="true"
                    class="ml-2 mr-2"
                    :no-badges="true"
                  />
                  <v-card-title class="text-center justify-center">
                    {{ friend.user.username }}
                  </v-card-title>
                </v-card>
              </v-slide-group>
            </v-card-text>
          </template>
          <template
            v-if="
              (!username && user?.friend === 'accepted') ||
              (user.id === $user.user?.id && !username)
            "
          >
            <v-divider></v-divider>
            <v-card-text class="text-overline">Statistics</v-card-text>
            <v-card-text>
              <v-row>
                <v-col sm="12" :md="!username ? 6 : 12" cols="12">
                  <v-card
                    class="text-center mt-n6"
                    v-if="hoursMost"
                    :height="$vuetify.display.mobile ? 400 : undefined"
                  >
                    <p class="mt-3">
                      <strong style="font-size: 24px" class="text-gradient">
                        Upload Distribution
                      </strong>
                    </p>
                    <v-card-subtitle>
                      {{ user.username }} uploads the most at
                      {{ hoursMost.hour }} with {{ hoursMost.count }} uploads!
                    </v-card-subtitle>
                    <Chart
                      id="userv2-hours"
                      :data="hoursGraph"
                      v-if="hoursGraph"
                      :max-height="$vuetify.display.mobile ? 320 : undefined"
                      :height="320"
                      type="bar"
                      name="Uploads"
                    ></Chart>
                  </v-card>
                </v-col>
                <v-col md="6" sm="12">
                  <v-card
                    class="text-center mt-n6"
                    v-if="user.stats.uploadGraph"
                    :height="$vuetify.display.mobile ? 400 : undefined"
                    max-height="400"
                  >
                    <GraphWidget
                      :upload-graph="user.stats.uploadGraph"
                      :message-graph="user.stats.messageGraph"
                      :pulse-graph="user.stats.pulseGraph"
                      :card-height="400"
                      :height="320"
                    ></GraphWidget>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </v-col>
        <v-col md="3" cols="12" sm="12" v-if="!username">
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
            title="Storage Used"
            :value="$functions.fileSize(user.quota || 0)"
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
            title="Documents"
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
import BarChart from "@/components/Core/BarChart.vue";
import LineChart from "@/components/Core/LineChart.vue";
import Chart from "@/components/Core/Chart.vue";
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";

export default defineComponent({
  name: "User",
  props: ["username"],
  components: {
    GraphWidget,
    Chart,
    LineChart,
    BarChart,
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
    hoursMost() {
      if (this.user?.stats?.hours) {
        let hours = Object.entries(this.user.stats.hours);
        hours.sort((a, b) => b[1] - a[1]);
        return {
          hour: hours[0][0],
          count: hours[0][1]
        };
      } else {
        return null;
      }
    },
    hoursGraph() {
      if (this.user?.stats?.hours) {
        return {
          labels: Object.keys(this.user.stats.hours),
          data: Object.values(this.user.stats.hours)
        };
      } else {
        return null;
      }
    },
    chartData() {
      if (this.user?.stats?.uploadGraph) {
        return {
          labels: this.user.stats.uploadGraph.labels,
          datasets: [
            {
              label: "Uploads",
              data: this.user.stats.uploadGraph.data,
              backgroundColor: "transparent",
              borderColor: "#0190ea",
              pointBackgroundColor: "#181818"
            }
          ]
        };
      } else {
        return [];
      }
    },
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
    async save() {
      this.settings.description.loading = true;
      await this.$user.save();
      if (this.user) this.user.description = this.$user.user?.description;
      this.settings.description.value = false;
      this.settings.description.loading = false;
    },
    async chat() {
      this.friendLoading = true;
      const data = await this.$chat.createChat([this.user?.id as number]);
      if (this.username) this.$chat.dialogs.user.value = false;
      this.$router.push(`/communications/${data.association.id}`);
    },
    async doFriendRequest() {
      try {
        this.friendLoading = true;
        await this.axios.post(`/user/friends/${this.user?.id}`);
        this.friendLoading = false;
        this.getUser(false);
      } catch {
        this.friendLoading = false;
      }
    },
    async getUser(load = true) {
      if (load && !this.username) {
        this.$app.componentLoading = true;
      }
      const username = this.username || this.$route.params.username;
      const { data } = await this.axios.get(`/user/profile/${username}`);
      this.user = data;
      if (!this.username) this.$app.title = this.user?.username as string;
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    if (!this.username) this.$app.title = "User";
    this.getUser();
  },
  watch: {
    "$route.params.username"(val) {
      if (!val) return;
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
.center {
  position: absolute;
  top: 50%;
}

.align-center {
  align-items: center;
}
.justify-end {
  justify-content: space-between;
}
.tpu-float-right {
  margin-left: auto;
}
.cont {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
</style>
