<template>
  <VErrorBoundary
    :fall-back="skullCrash"
    :params="{ e: error, name: 'UserV3 widget' }"
    stop-propagation
  >
    <v-toolbar v-if="editMode" border class="rounded-xl">
      <v-toolbar-title>
        {{ components.find((c) => c.id === component.name).name }}
      </v-toolbar-title>
      <v-btn @click="$emit('delete', component)" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn @click="$emit('settings', component.id)" icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="$emit('moveUp', component)" icon>
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
      <v-btn @click="$emit('moveDown', component)" icon>
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
      <v-icon class="drag-handle mr-3 ml-1">mdi-drag</v-icon>
    </v-toolbar>
    <template v-if="willShow(component, 'parent')">
      <template v-if="editMode">
        <v-card-subtitle class="mt-2">Dev UserV3 actions:</v-card-subtitle>
        <v-btn @click="addItemDebug(comp.id)" v-for="comp in components">
          Add {{ comp.name }}
        </v-btn>
      </template>
      <v-row>
        <v-col
          v-for="child in component.props.children"
          md="12"
          :xl="12 / component.props.children.length"
        >
          <UserV3ComponentHandler
            :user="user"
            :username="username"
            :component="child"
            :components="components"
            :gold="gold"
            :primary="primary"
            :editMode="editMode"
            @settings="$emit('settings', $event)"
          ></UserV3ComponentHandler>
        </v-col>
      </v-row>
    </template>
    <div
      :style="{ height: component.props?.height + 'px' }"
      v-else-if="willShow(component, 'spacer')"
    ></div>
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
      :primary="primary"
    ></core-statistics>
    <LastFM
      :component="component"
      :user="user"
      v-else-if="willShow(component, 'last-fm')"
    />
    <my-anime-list
      :component="component"
      :user="user"
      v-else-if="willShow(component, 'mal')"
    />
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
  </VErrorBoundary>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MutualCollections from "@/components/Users/UserV3/Widgets/MutualCollections.vue";
import ProfileInfo from "@/components/Users/UserV3/Widgets/ProfileInfo.vue";
import MutualFriends from "@/components/Users/UserV3/Widgets/MutualFriends.vue";
import CoreStatistics from "@/components/Users/UserV3/Widgets/CoreStatistics.vue";
import LastFM from "@/components/Users/UserV3/Widgets/LastFM.vue";
import MyAnimeList from "@/components/Users/UserV3/Widgets/MyAnimeList.vue";
import VErrorBoundary from "@/components/Core/ErrorBoundary.vue";
import Crash from "@/components/Core/CrashAlt.vue";
import { Component } from "@/types/userv3";

export default defineComponent({
  name: "UserV3ComponentHandler",
  components: {
    MyAnimeList,
    LastFM,
    CoreStatistics,
    MutualFriends,
    ProfileInfo,
    MutualCollections,
    VErrorBoundary
  },
  props: [
    "component",
    "user",
    "username",
    "gold",
    "primary",
    "components",
    "editMode"
  ],
  emits: ["addToParent", "delete", "moveUp", "moveDown", "settings"],
  data() {
    return {
      skullCrash: Crash,
      error: null
    };
  },
  methods: {
    addItemDebug(name: string) {
      this.$emit("addToParent", {
        name,
        id: this.$functions.uuid(),
        props: this.components.find((c) => c.id === name)?.props
      });
    },
    willShow(component: Component, name: string) {
      if (component.name !== name) return false;
      if (
        component.props?.friendsOnly &&
        this.user?.friend !== "accepted" &&
        this.user?.id !== this.$user.user?.id
      )
        return false;
      if (component.props?.mutualFriends && !this.user?.friends?.length)
        return false;
      if (component.props?.mutualCollections && !this.user?.collections?.length)
        return false;
      return true;
    }
  }
});
</script>

<style scoped></style>
