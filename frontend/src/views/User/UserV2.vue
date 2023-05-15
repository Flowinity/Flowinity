<template>
  <div v-if="user">
    <UserBanner
      :height="username ? 250 : undefined"
      :user="user"
      @refreshUser="getUser(false)"
    ></UserBanner>
    <v-container :style="username ? 'max-width: 100%;' : ''" class="mt-2">
      <v-row>
        <v-col :lg="!username ? 9 : 12" cols="12" md="12">
          <v-row no-gutters>
            <v-col sm="auto">
              <v-hover v-slot="{ isHovering }">
                <UserAvatar
                  :edit="user.id === $user.user?.id"
                  :no-badges="true"
                  :size="$vuetify.display.mobile ? 55 : 110"
                  :status="true"
                  :user="user"
                  class="mr-4"
                  @refresh="getUser(false)"
                >
                  <transition
                    v-if="$user.user?.id === user.id"
                    :duration="{ enter: 300, leave: 300 }"
                    appear
                    name="fade-transition"
                  >
                    <v-btn
                      v-if="isHovering"
                      class="rounded-xl"
                      icon
                      style="position: absolute; top: 10px; right: 10px"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </transition>
                </UserAvatar>
              </v-hover>
            </v-col>
            <v-col class="d-flex align-center" sm="100%">
              <v-card-text class="ml-n2">
                <div>
                  <h1
                    :class="username ? 'mb-2 pointer' : ''"
                    style="font-weight: 500"
                    @click="
                      username ? $router.push(`/u/${username}`) : () => {}
                    "
                  >
                    {{ $friends.getName(user) }}
                    <span
                      v-if="$friends.getName(user) !== user.username"
                      class="text-grey"
                      style="font-size: 18px"
                    >
                      ({{ user.username }})
                    </span>
                    <v-btn
                      v-if="user?.friend === 'accepted'"
                      icon
                      size="x-small"
                      @click.stop="
                        $app.dialogs.nickname.userId = user?.id || 0;
                        $app.dialogs.nickname.value = true;
                      "
                    >
                      <v-tooltip
                        :eager="false"
                        activator="parent"
                        location="top"
                      >
                        Set friend nickname
                      </v-tooltip>
                      <v-icon>mdi-rename</v-icon>
                    </v-btn>
                  </h1>
                  <UserBadges
                    :primaryColor="primaryColorResult"
                    :user="user"
                  ></UserBadges>
                </div>
              </v-card-text>
            </v-col>
            <v-col
              v-if="user.id !== $user.user?.id"
              class="d-flex align-center"
              sm="auto"
              style="justify-content: flex-end"
            >
              <v-card-text>
                <v-btn
                  v-if="friends"
                  :color="friends.color"
                  :loading="friendLoading"
                  shaped
                  @click="doFriendRequest"
                >
                  <v-icon class="mr-2">
                    {{ friends.icon }}
                  </v-icon>
                  {{ friends.text }}
                </v-btn>
                <v-btn
                  v-if="
                    user?.friend === 'accepted' &&
                    $experiments.experiments['COMMUNICATIONS']
                  "
                  :loading="friendLoading"
                  class="ml-2"
                  color="primary"
                  shaped
                  @click="chat"
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
            v-if="!settings.description.value"
            class="mt-n7"
            style="overflow-wrap: break-word; white-space: pre-line"
          >
            {{ user.description }}
            <v-btn
              v-if="$user.user?.id === user.id"
              class="grey--text"
              icon
              size="x-small"
              @click="settings.description.value = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-text
            v-else
            class="mt-n7"
            style="overflow-wrap: break-word; white-space: pre-line"
          >
            <v-textarea
              v-model="$user.changes.description"
              :counter="255"
              :rows="1"
              auto-grow
              autofocus
              dense
              outlined
              @keydown.esc="settings.description.value = false"
              @keydown.exact.ctrl.enter="save"
            ></v-textarea>
            <v-card-actions class="mt-n4">
              <v-spacer></v-spacer>
              <v-btn
                :loading="settings.description.loading"
                color="primary"
                @click="save"
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
                  v-for="collection in user.collections"
                  :key="collection.id"
                  :item="
                    $collections.items.find((item) => item.id === collection.id)
                  "
                  class="mr-4"
                  style="width: 400px"
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
                  v-for="friend in user.friends"
                  :key="friend.id"
                  :to="!username ? `/u/${friend.user.username}` : undefined"
                  class="rounded-xl pt-3 justify-center text-center px-2 no-border"
                  color="transparent"
                  elevation="0"
                  @click="
                    username
                      ? ($chat.dialogs.user.username = friend.user.username)
                      : null
                  "
                >
                  <UserAvatar
                    :no-badges="true"
                    :status="true"
                    :user="friend.user"
                    class="ml-2 mr-2"
                    size="100"
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
                <v-col :md="!username ? 6 : 12" cols="12" sm="12">
                  <v-card
                    v-if="hoursMost"
                    :height="$vuetify.display.mobile ? 400 : undefined"
                    class="text-center mt-n6"
                  >
                    <p class="mt-3">
                      <strong class="text-gradient" style="font-size: 24px">
                        Upload Distribution
                      </strong>
                    </p>
                    <v-card-subtitle>
                      {{ user.username }} uploads the most at
                      {{ hoursMost.hour }} with {{ hoursMost.count }} uploads!
                    </v-card-subtitle>
                    <Chart
                      v-if="hoursGraph"
                      id="userv2-hours"
                      :color="primaryColorResult"
                      :data="hoursGraph"
                      :height="320"
                      :max-height="$vuetify.display.mobile ? 320 : undefined"
                      name="Uploads"
                      type="bar"
                    ></Chart>
                  </v-card>
                </v-col>
                <v-col md="6" sm="12">
                  <v-card
                    v-if="user.stats.uploadGraph"
                    :height="$vuetify.display.mobile ? 400 : undefined"
                    class="text-center mt-n6"
                    max-height="400"
                  >
                    <GraphWidget
                      :card-height="400"
                      :gold="gold"
                      :height="320"
                      :message-graph="user.stats.messageGraph"
                      :primary-color="primaryColorResult"
                      :pulse-graph="user.stats.pulseGraph"
                      :upload-graph="user.stats.uploadGraph"
                    ></GraphWidget>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </v-col>
        <v-col v-if="!username" cols="12" md="3" sm="12">
          <InsightsPromoCard
            v-if="
              user.insights === 'everyone' ||
              (user.insights === 'friends' && user.friend === 'accepted')
            "
            :end-color="user.plan.id === 6 ? '#F57F17' : '#4A148C'"
            :gold="gold"
            :start-color="user.plan.id === 6 ? '#FBC02D' : '#6A1B9A'"
            :username="user.username"
          ></InsightsPromoCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="$date(user.createdAt).format('DD/MM/YYYY')"
            class="my-3"
            title="Creation date"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="user.stats.uploads.toLocaleString()"
            class="my-3"
            title="Uploads"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="$functions.fileSize(user.quota || 0)"
            class="my-3"
            title="Storage Used"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="user.stats.collections.toLocaleString()"
            class="my-3"
            title="Collections"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="user.stats.collectionItems.toLocaleString()"
            class="my-3"
            title="Collectivizations"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="user.stats.pulse.toLocaleString()"
            class="my-3"
            title="TPU Hours"
          ></StatsCard>
          <StatsCard
            :gold="gold"
            :primary-color="primaryColorResult"
            :value="user.stats.docs"
            class="my-3"
            title="Documents"
          ></StatsCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import UserBanner from "@/components/Users/UserBanner.vue"
import UserAvatar from "@/components/Users/UserAvatar.vue"
import UserBadges from "@/components/Users/UserBadges.vue"
import {User} from "@/models/user"
import CollectionBanner from "@/components/Collections/CollectionBanner.vue"
import CollectionCard from "@/components/Collections/CollectionCard.vue"
import StatsCard from "@/components/Dashboard/StatsCard.vue"
import BarChart from "@/components/Core/BarChart.vue"
import LineChart from "@/components/Core/LineChart.vue"
import Chart from "@/components/Core/Chart.vue"
import GraphWidget from "@/components/Dashboard/GraphWidget.vue"
import InsightsPromoCard from "@/views/Insights/PromoCard.vue"
import {DefaultThemes} from "@/plugins/vuetify"

export default defineComponent({
  name: "UserV2",
  props: ["username"],
  components: {
    InsightsPromoCard,
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
    }
  },
  computed: {
    primaryColorResult() {
      return this.$user.primaryColorResult(this.primary, this.gold).primary
    },
    primary() {
      return this.user?.themeEngine?.theme[
        this.$vuetify.theme.name as "dark" | "light" | "amoled"
        ].colors.primary
    },
    gold() {
      return this.user?.plan.internalName === "GOLD"
    },
    hoursMost() {
      if (this.user?.stats?.hours) {
        let hours = Object.entries(this.user.stats.hours)
        hours.sort((a: any, b: any) => b[1] - a[1])
        return {
          hour: hours[0][0],
          count: hours[0][1]
        }
      } else {
        return null
      }
    },
    hoursGraph() {
      if (this.user?.stats?.hours) {
        return {
          labels: Object.keys(this.user.stats.hours),
          data: Object.values(this.user.stats.hours)
        }
      } else {
        return null
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
        }
      } else {
        return []
      }
    },
    friends() {
      if (this.user?.friend === "accepted") {
        return {
          text: "Remove Friend",
          color: "red",
          icon: "mdi-account-minus"
        }
      } else if (this.user?.friend === "outgoing") {
        return {
          text: "Cancel Request",
          color: "grey",
          icon: "mdi-account-minus"
        }
      } else if (this.user?.friend === "incoming") {
        return {
          text: "Accept Request",
          color: "green",
          icon: "mdi-account-plus"
        }
      } else {
        return {
          text: "Add Friend",
          color: "green",
          icon: "mdi-account-plus"
        }
      }
    },
    disableProfileColors() {
      try {
        return JSON.parse(localStorage.getItem("disableProfileColors")!)
      } catch {
        return false
      }
    }
  },
  methods: {
    setTheme(reset: boolean = false) {
      if (this.disableProfileColors) return false
      if (this.username) return false
      if (this.user?.themeEngine?.version !== 1 && !reset) {
        this.setTheme(true)
        return false
      }
      const theme = reset
        ? this.$user.changes.themeEngine?.theme ||
        new DefaultThemes(this.$user.gold).themes
        : this.user?.themeEngine?.theme
      if (!theme) return false
      this.$vuetify.theme.themes.dark = {
        ...this.$vuetify.theme.themes.dark,
        ...theme.dark
      }
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...theme.light
      }
      this.$vuetify.theme.themes.amoled = {
        ...this.$vuetify.theme.themes.amoled,
        ...theme.amoled
      }
      if (!reset) {
        document.body.style.setProperty(
          "--gradient-offset",
          `${
            this.user?.themeEngine?.gradientOffset ||
            this.$user.changes.themeEngine.gradientOffset
          }%`
        )
        this.$app.fluidGradient =
          this.user?.themeEngine?.fluidGradient || this.$app.fluidGradient
      } else {
        document.body.style.setProperty(
          "--gradient-offset",
          `${this.$user.changes?.themeEngine?.gradientOffset || 100}%`
        )
        this.$app.fluidGradient =
          this.$user.changes?.themeEngine?.fluidGradient || false
      }
      return true
    },
    async save() {
      this.settings.description.loading = true
      await this.$user.save()
      if (this.user) this.user.description = this.$user.user?.description
      this.settings.description.value = false
      this.settings.description.loading = false
    },
    async chat() {
      this.friendLoading = true
      const data = await this.$chat.createChat([this.user?.id as number])
      if (this.username) this.$chat.dialogs.user.value = false
      this.$router.push(`/communications/${data.association.id}`)
    },
    async doFriendRequest() {
      try {
        this.friendLoading = true
        await this.axios.post(`/user/friends/${this.user?.id}`)
        this.friendLoading = false
        this.getUser(false)
      } catch {
        this.friendLoading = false
      }
    },
    async getUser(load = true) {
      if (load && !this.username) {
        this.$app.componentLoading = true
      }
      const username = this.username || this.$route.params.username
      const {data} = await this.axios.get(`/user/profile/${username}`)
      this.user = data
      if (!this.username) this.$app.title = this.user?.username + "'s Profile"
      this.setTheme()
      this.$app.componentLoading = false
    }
  },
  mounted() {
    if (!this.username) this.$app.title = "User"
    this.getUser()
  },
  unmounted() {
    this.setTheme(true)
  },
  watch: {
    "$route.params.username"(val) {
      if (!val) return
      this.getUser()
    }
  }
})
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

.text-gradient {
  background: -webkit-linear-gradient(
    v-bind("$user.primaryColorResult(primary, gold).gradient1"),
    v-bind("$user.primaryColorResult(primary, gold).gradient2")
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
