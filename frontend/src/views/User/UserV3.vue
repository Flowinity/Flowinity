<template>
  <div v-if="user">
    <UserV3Settings
      v-model="config.dialog"
      :component="selectedComponent"
      :components="components"
      :user="user"
      @trigger="layout = $user.changes.profileLayout"
      @update="updateProp"
    ></UserV3Settings>
    <UserBanner
      :height="username ? 250 : undefined"
      :user="user"
      @refreshUser="getUser(false)"
    ></UserBanner>
    <v-container class="mt-2" style="max-width: 100%">
      <v-row>
        <v-col
          :lg="layout.config.showStatsSidebar === false ? 12 : 9"
          :xl="layout.config.showStatsSidebar === false ? 12 : 10"
          cols="12"
          md="8"
        >
          <v-row
            :class="{ 'text-center': $vuetify.display.mobile }"
            class="mb-2"
            no-gutters
          >
            <v-col :cols="$vuetify.display.mobile ? 12 : undefined" sm="auto">
              <v-hover v-slot="{ isHovering }">
                <UserAvatar
                  :class="{ 'mr-4': !$vuetify.display.mobile }"
                  :edit="user.id === $user.user?.id"
                  :no-badges="true"
                  :status="true"
                  :user="user"
                  size="110"
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
                      v-if="
                        $experiments.experiments.USER_V3_MODIFY &&
                        user?.id === $user.user?.id
                      "
                      icon
                      size="small"
                      @click="
                        config.component = undefined;
                        config.dialog = true;
                      "
                    >
                      <v-tooltip
                        :eager="false"
                        activator="parent"
                        location="top"
                      >
                        Settings
                      </v-tooltip>
                      <v-icon>mdi-cog</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="
                        $experiments.experiments.USER_V3_MODIFY &&
                        user?.id === $user.user?.id
                      "
                      icon
                      size="small"
                      @click="config.editMode = !config.editMode"
                    >
                      <v-tooltip
                        :eager="false"
                        activator="parent"
                        location="top"
                      >
                        Edit Mode
                      </v-tooltip>
                      <v-icon v-if="!config.editMode">mdi-pencil</v-icon>
                      <v-icon v-else>mdi-check</v-icon>
                    </v-btn>
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
                    :class="{ 'justify-center': $vuetify.display.mobile }"
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
          <template
            v-if="
              $experiments.experiments.USER_V3_EDITOR &&
              user?.id === $user.user?.id &&
              config.editMode
            "
          >
            <v-card-subtitle class="mt-2">Dev UserV3 actions:</v-card-subtitle>
            <v-btn v-for="comp in components" @click="addItemDebug(comp.id)">
              Add {{ comp.name }}
            </v-btn>
            <v-btn color="red" @click="layout = defaultLayout">Reset</v-btn>
            <v-btn
              color="primary"
              @click="$experiments.experiments.USER_V3 = false"
            >
              UserV2
            </v-btn>
            <v-alert
              style="
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
              "
              type="warning"
              variant="tonal"
            >
              Warning: do not CTRL + S unless you are sure the syntax is
              correct.
            </v-alert>
            <vue-monaco-editor
              v-model:value="layoutEditor"
              language="json"
              style="max-height: 300px"
              theme="vs-dark"
            ></vue-monaco-editor>
          </template>
          <UserV3AddMenu
            v-if="config.editMode"
            :components="visibleComponents"
            @add="addItemDebug"
          />
          <VueDraggable
            v-model="layout.layout.columns[0].rows"
            :disabled="!config.editMode"
            handle=".drag-handle"
            item-key="id"
            @update="setLayout"
          >
            <div
              v-for="component in layout.layout.columns[0].rows"
              :key="component.id"
            >
              <UserV3ComponentHandler
                :component="component"
                :components="visibleComponents"
                :editMode="config.editMode"
                :gold="gold"
                :primary="primary"
                :user="user"
                :username="username"
                @addToParent="component.props.children.push($event)"
                @delete="deleteComponent($event || component)"
                @moveDown="move($event || component, 1)"
                @moveUp="move($event || component, -1)"
                @settings="
                  config.component = $event || component;
                  config.dialog = true;
                "
                @modifyProp="component.props[$event.prop] = $event.value"
              ></UserV3ComponentHandler>
            </div>
          </VueDraggable>
        </v-col>
        <v-col
          v-if="!username && layout.config?.showStatsSidebar !== false"
          cols="12"
          md="3"
          sm="12"
          xl="2"
        >
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
import { defineComponent } from "vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import { ProfileLayout, User } from "@/models/user";
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
import MyAnimeList from "@/components/Users/UserV3/Widgets/MyAnimeList.vue";
import UserV3Settings from "@/components/Users/UserV3/Dialogs/Settings.vue";
import UserV3ComponentHandler from "@/components/Users/UserV3/Widgets/ComponentHandler.vue";
import { VueDraggable } from "vue-draggable-plus";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
import { Component } from "@/types/userv3";
import UserV3AddMenu from "@/components/Users/UserV3/AddMenu.vue";

export default defineComponent({
  name: "UserV3",
  props: ["username"],
  components: {
    UserV3AddMenu,
    UserV3ComponentHandler,
    UserV3Settings,
    MyAnimeList,
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
    UserBanner,
    VueDraggable,
    VueMonacoEditor
  },
  data() {
    return {
      config: {
        dialog: false,
        editMode: false,
        component: undefined as string | undefined
      },
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
                  id: this.$functions.uuid(),
                  props: {
                    mutualCollections: true
                  }
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
          showStatsSidebar: true
        },
        version: 1
      } as any,
      layout: null as ProfileLayout | null,
      user: undefined as User | undefined,
      friendLoading: false,
      editorTmp: ""
    };
  },
  computed: {
    components() {
      return [
        {
          id: "spacer",
          name: "Spacer",
          props: {
            height: 1
          },
          meta: {
            height: {
              name: "Height"
            }
          }
        },
        {
          id: "parent",
          name: "Parent",
          props: {
            children: [] as Component[]
          }
        },
        {
          id: "profile-info",
          name: "Profile Info"
        },
        {
          id: "divider",
          name: "Divider"
        },
        {
          id: "social-links",
          name: "Social Links",
          props: {
            friendsOnly: false,
            links: []
          },
          meta: {
            friendsOnly: {
              name: "Friends only",
              description: "Only show when the user is friends with you."
            },
            links: {
              name: "Links",
              description: "A list of social links to display."
            }
          }
        },
        {
          id: "mutual-collections",
          name: "Mutual Collections",
          props: {
            mutualCollections: true
          }
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
          },
          meta: {
            friendsOnly: {
              name: "Friends only",
              description: "Only show when the user is friends with you."
            }
          }
        },
        {
          id: "last-fm",
          name: "Last.fm",
          disabled: !this.$user.user?.integrations.find(
            (x) => x.type === "lastfm"
          ),
          props: {
            friendsOnly: false,
            display: 7,
            type: "recent"
          },
          meta: {
            friendsOnly: {
              name: "Friends only",
              description: "Only show when the user is friends with you."
            },
            display: {
              name: "Display count",
              description: "How many items to display.",
              type: "range",
              min: 1,
              max: 12,
              step: 1
            },
            type: {
              name: "Type",
              type: "select",
              options: [
                { text: "Recent", value: "recent" },
                { text: "Top", value: "top" }
              ]
            }
          }
        },
        {
          id: "mal",
          name: "MyAnimeList",
          disabled: !this.$user.user?.integrations.find(
            (x) => x.type === "mal"
          ),
          props: {
            friendsOnly: false,
            type: "anime",
            display: 3
          },
          meta: {
            friendsOnly: {
              name: "Friends only",
              description: "Only show when the user is friends with you."
            },
            type: {
              name: "Type",
              type: "select",
              options: [
                { text: "Anime", value: "anime" },
                { text: "Manga", value: "manga" },
                { text: "Profile stats", value: "profile" }
              ]
            },
            display: {
              name: "Display count",
              description: "How many items to display if type is anime/manga.",
              type: "range",
              min: 1,
              max: 10,
              step: 1
            }
          }
        },
        {
          id: "spotify",
          name: "Spotify",
          visible: false,
          props: {
            friendsOnly: false
          }
        },
        {
          id: "steam",
          name: "Steam",
          visible: false,
          props: {
            friendsOnly: false
          }
        },
        {
          id: "github",
          name: "GitHub",
          visible: false,
          props: {
            friendsOnly: false
          }
        },
        {
          id: "jitsi",
          name: "Jitsi Stats",
          visible: false,
          props: {
            friendsOnly: false
          }
        },
        {
          id: "geoguess",
          name: "GeoGuess",
          visible: false,
          props: {
            friendsOnly: false
          }
        }
      ] as Component[];
    },
    visibleComponents() {
      return this.components.filter((x) => x.visible !== false);
    },
    selectedComponent() {
      let component = this.layout.layout.columns[0].rows.find(
        (x) => x.id === this.config.component
      );
      if (!component) {
        component = this.layout.layout.columns[0].rows
          .find(
            (x) =>
              x?.props?.children &&
              x?.props?.children?.find(
                (y: Component) => y.id === this.config.component
              )
          )
          ?.props?.children?.find(
            (y: Component) => y.id === this.config.component
          );
      }
      if (!component) return null;
      return component;
    },
    layoutEditor: {
      get() {
        return JSON.stringify(this.layout, null, 2);
      },
      set(val) {
        this.editorTmp = val;
      }
    },
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
    findComponent(id: string) {
      let component = this.layout.layout.columns[0].rows.find(
        (x) => x.id === id
      );
      if (component)
        return {
          component,
          parent: this.layout.layout.columns[0]
        };
      component = this.layout.layout.columns[0].rows
        .find(
          (x) =>
            x?.props?.children &&
            x?.props?.children?.find((y: Component) => y.id === id)
        )
        ?.props?.children?.find((y: Component) => y.id === id);
      return {
        component,
        parent: this.layout.layout.columns[0].rows.find(
          (x) =>
            x?.props?.children &&
            x?.props?.children?.find((y: Component) => y.id === id)
        )
      };
    },
    updateProp(data: { key: string; value: any }) {
      if (!this.selectedComponent) return;
      this.selectedComponent.props[data.key] = data.value;
    },
    deleteComponent(component: Component) {
      const comp = this.findComponent(component.id);
      console.log(comp, component);
      if (!comp?.component) return;
      if (comp.parent.rows) {
        comp.parent.rows.splice(comp.parent.rows.indexOf(comp.component), 1);
      } else {
        comp.parent.props.children.splice(
          comp.parent.props.children.indexOf(comp.component),
          1
        );
      }
    },
    move(component: Component, count: number) {
      const comp = this.findComponent(component.id);
      console.log(comp, component);
      if (!comp?.component) return;
      if (comp.parent.rows) {
        const index = comp.parent.rows.indexOf(comp.component);
        comp.parent.rows.splice(index, 1);
        comp.parent.rows.splice(index + count, 0, comp.component);
      } else {
        const index = comp.parent.props.children.indexOf(comp.component);
        comp.parent.props.children.splice(index, 1);
        comp.parent.props.children.splice(index + count, 0, comp.component);
      }
    },
    setLayout(layout: ProfileLayout) {
      console.log(layout);
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
        if (!this.$user?.user) await this.$router.push("/login");
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
    },
    eventListener(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        console.log(this.editorTmp);
        try {
          this.layout = JSON.parse(this.editorTmp);
        } catch {
          this.$toast.error("Invalid JSON");
        }
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", (e) => this.eventListener(e));
    if (!this.username) this.$app.title = "User";
    this.getUser();
  },
  unmounted() {
    document.removeEventListener("keydown", (e) => this.eventListener(e));
    this.setTheme(true);
  },
  watch: {
    "$route.params.username"(val) {
      if (!val) return;
      this.getUser();
    },
    layout: {
      handler(val) {
        if (this.user?.id !== this.$user.user?.id) return;
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
