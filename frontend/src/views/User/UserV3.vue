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
              <v-hover v-slot="{ isHovering }">
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
                      v-if="isHovering"
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
                  <h1
                    style="font-weight: 500"
                    :class="username ? 'mb-2 pointer' : ''"
                    @click="
                      username ? $router.push(`/u/${username}`) : () => {}
                    "
                  >
                    {{ $friends.getName(user) }}
                    <span
                      style="font-size: 18px"
                      class="text-grey"
                      v-if="$friends.getName(user) !== user.username"
                    >
                      ({{ user.username }})
                    </span>
                    <v-btn
                      icon
                      size="x-small"
                      @click.stop="
                        $app.dialogs.nickname.userId = user?.id || 0;
                        $app.dialogs.nickname.value = true;
                      "
                      v-if="user?.friend === 'accepted'"
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
                    :user="user"
                    :primaryColor="primaryColorResult"
                  ></UserBadges>
                </div>
              </v-card-text>
            </v-col>
            <v-col
              class="d-flex align-center"
              sm="auto"
              style="justify-content: flex-end"
              v-if="user.id !== $user.user?.id"
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
          <v-card-subtitle class="mt-2">Dev UserV3 actions:</v-card-subtitle>
          <v-btn @click="addItemDebug(comp.id)" v-for="comp in components">
            Add {{ comp.name }}
          </v-btn>
          <v-btn @click="layout = defaultLayout" color="red">Reset</v-btn>
          <v-btn
            @click="$experiments.experiments.USER_V3 = false"
            color="primary"
          >
            UserV2
          </v-btn>
          <template
            v-for="component in layout.layout.columns[0].rows"
            :key="component.id"
          >
            <v-divider v-if="willShow(component, 'divider')"></v-divider>
            <profile-info
              v-else-if="component.name === 'profile-info'"
              :user="user"
              :username="username"
            ></profile-info>
            <mutual-collections
              v-else-if="willShow(component, 'mutual-collections')"
              :user="user"
              :username="username"
            ></mutual-collections>
            <mutual-friends
              v-else-if="willShow(component, 'mutual-friends')"
              :user="user"
              :username="username"
            ></mutual-friends>
            <core-statistics
              v-else-if="willShow(component, 'core-statistics')"
              :user="user"
              :username="username"
              :gold="gold"
            ></core-statistics>
            <last-f-m :user="user" v-else-if="willShow(component, 'last-fm')" />
            <v-card v-else-if="component.name === 'v-card'">
              <v-card-title>
                <h3>{{ component.props.title }}</h3>
              </v-card-title>
              <v-card-text>
                <p>{{ component.props.text }}</p>
              </v-card-text>
              <v-card-actions v-if="component.props.actions?.length">
                <v-btn
                  v-for="action in component.props.actions"
                  :key="action"
                  :v-bind="action"
                  :to="action"
                >
                  {{ action.text }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-col>
        <v-col md="3" cols="12" sm="12" v-if="!username">
          <InsightsPromoCard
            :start-color="user.plan.id === 6 ? '#FBC02D' : '#6A1B9A'"
            :end-color="user.plan.id === 6 ? '#F57F17' : '#4A148C'"
            :username="user.username"
            v-if="
              user.insights === 'everyone' ||
              (user.insights === 'friends' && user.friend === 'accepted')
            "
            :gold="gold"
          ></InsightsPromoCard>
          <StatsCard
            title="Creation date"
            :value="$date(user.createdAt).format('DD/MM/YYYY')"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="Uploads"
            :value="user.stats.uploads.toLocaleString()"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="Storage Used"
            :value="$functions.fileSize(user.quota || 0)"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="Collections"
            :value="user.stats.collections.toLocaleString()"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="Collectivizations"
            :value="user.stats.collectionItems.toLocaleString()"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="TPU Hours"
            :value="user.stats.pulse.toLocaleString()"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
          ></StatsCard>
          <StatsCard
            title="Documents"
            :value="user.stats.docs"
            class="my-3"
            :primary-color="primaryColorResult"
            :gold="gold"
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
import InsightsPromoCard from "@/views/Insights/PromoCard.vue";
import { DefaultThemes } from "@/plugins/vuetify";
import ProfileInfo from "@/components/Users/UserV3/Widgets/ProfileInfo.vue";
import MutualCollections from "@/components/Users/UserV3/Widgets/MutualCollections.vue";
import MutualFriends from "@/components/Users/UserV3/Widgets/MutualFriends.vue";
import CoreStatistics from "@/components/Users/UserV3/Widgets/CoreStatistics.vue";
import LastFM from "@/components/Users/UserV3/Widgets/LastFM.vue";

interface Component {
  id: string;
  name: string;
  props?: Record<string, any>;
}

export default defineComponent({
  name: "UserV3",
  props: ["username"],
  components: {
    LastFM,
    CoreStatistics,
    MutualFriends,
    MutualCollections,
    ProfileInfo,
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
      components: [
        {
          id: "v-card",
          name: "VCard",
          props: {
            title: "Card Title",
            text: "Card Text",
            actions: [
              {
                text: "Click me",
                to: "/"
              }
            ]
          }
        },
        {
          id: "profile-info",
          name: "Profile Info"
        },
        {
          id: "divider",
          name: "VDivider"
        },
        {
          id: "mutual-collections",
          name: "Mutual Collections"
        },
        {
          id: "mutual-friends",
          name: "Mutual Friends"
        },
        {
          id: "core-statistics",
          name: "Core Statistics",
          props: {
            friendsOnly: true
          }
        },
        {
          id: "last-fm",
          name: "Last.fm",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "mal",
          name: "MyAnimeList",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "anilist",
          name: "AniList",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "spotify",
          name: "Spotify",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "steam",
          name: "Steam",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "github",
          name: "GitHub",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "jitsi",
          name: "Jitsi Stats",
          props: {
            friendsOnly: false
          }
        },
        {
          id: "geoguess",
          name: "GeoGuess",
          props: {
            friendsOnly: false
          }
        }
      ] as any[],
      defaultLayout: {
        layout: {
          columns: [
            {
              rows: [
                {
                  name: "profile-info",
                  id: this.$functions.uuid()
                },
                {
                  name: "divider",
                  id: this.$functions.uuid(),
                  props: {
                    mutualCollections: true
                  }
                },
                {
                  name: "mutual-collections",
                  id: this.$functions.uuid()
                },
                {
                  name: "divider",
                  id: this.$functions.uuid(),
                  props: {
                    mutualFriends: true
                  }
                },
                {
                  name: "mutual-friends",
                  id: this.$functions.uuid(),
                  props: {
                    mutualFriends: true
                  }
                },
                {
                  name: "divider",
                  id: this.$functions.uuid(),
                  props: {
                    friendsOnly: true
                  }
                },
                {
                  name: "core-statistics",
                  id: this.$functions.uuid(),
                  props: {
                    friendsOnly: true
                  }
                }
              ]
            }
          ]
        },
        config: {
          containerMargin: undefined,
          showStatusSidebar: true
        },
        version: 1
      } as any,
      layout: null,
      user: undefined as User | undefined,
      friendLoading: false
    };
  },
  computed: {
    primaryColorResult() {
      return this.$user.primaryColorResult(this.primary, this.gold).primary;
    },
    primary() {
      return this.user?.themeEngine?.theme[
        this.$vuetify.theme.name as "dark" | "light" | "amoled"
      ].colors.primary;
    },
    gold() {
      return this.user?.plan.internalName === "GOLD";
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
    },
    disableProfileColors() {
      try {
        return JSON.parse(localStorage.getItem("disableProfileColors")!);
      } catch {
        return false;
      }
    }
  },
  methods: {
    willShow(component: Component, name: string) {
      if (component.name !== name) return false;
      if (
        component.props?.friendsOnly &&
        this.friends !== "accepted" &&
        this.user?.id !== this.$user.user?.id
      )
        return false;
      if (component.props?.mutualFriends && !this.user?.friends?.length)
        return false;
      if (component.props?.mutualCollections && !this.user?.collections?.length)
        return false;
      return true;
    },
    addItemDebug(name: string) {
      this.layout.layout.columns[0].rows.unshift({
        name,
        id: this.$functions.uuid(),
        props: this.components.find((c) => c.id === name)?.props
      });
    },
    setTheme(reset: boolean = false) {
      if (this.disableProfileColors) return false;
      if (this.username) return false;
      if (this.user?.themeEngine?.version !== 1 && !reset) {
        this.setTheme(true);
        return false;
      }
      const theme = reset
        ? this.$user.changes.themeEngine?.theme ||
          new DefaultThemes(this.$user.gold).themes
        : this.user?.themeEngine?.theme;
      if (!theme) return false;
      this.$vuetify.theme.themes.dark = {
        ...this.$vuetify.theme.themes.dark,
        ...theme.dark
      };
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...theme.light
      };
      this.$vuetify.theme.themes.amoled = {
        ...this.$vuetify.theme.themes.amoled,
        ...theme.amoled
      };
      if (!reset) {
        document.body.style.setProperty(
          "--gradient-offset",
          `${
            this.user?.themeEngine?.gradientOffset ||
            this.$user.changes.themeEngine.gradientOffset
          }%`
        );
        this.$app.fluidGradient =
          this.user?.themeEngine?.fluidGradient || this.$app.fluidGradient;
      } else {
        document.body.style.setProperty(
          "--gradient-offset",
          `${this.$user.changes?.themeEngine?.gradientOffset || 100}%`
        );
        this.$app.fluidGradient =
          this.$user.changes?.themeEngine?.fluidGradient || false;
      }
      return true;
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
      this.layout = this.user?.profileLayout || this.defaultLayout;
      if (!this.username) this.$app.title = this.user?.username + "'s Profile";
      this.setTheme();
      this.$app.componentLoading = false;
    }
  },
  mounted() {
    if (!this.username) this.$app.title = "User";
    this.getUser();
  },
  unmounted() {
    this.setTheme(true);
  },
  watch: {
    "$route.params.username"(val) {
      if (!val) return;
      this.getUser();
    },
    layout: {
      handler(val) {
        this.$user.changes.profileLayout = val;
        this.$user.save();
      },
      deep: true
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
.text-gradient {
  background: -webkit-linear-gradient(
    v-bind("$user.primaryColorResult(primary, gold).gradient1"),
    v-bind("$user.primaryColorResult(primary, gold).gradient2")
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
