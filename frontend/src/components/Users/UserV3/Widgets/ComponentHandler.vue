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
      <v-btn icon @click="$emit('delete', component)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn
        v-if="
          component.name !== 'parent' &&
          components.find((c) => c.id === component.name).props
        "
        icon
        @click="$emit('settings', component.id)"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('moveUp', component)">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('moveDown', component)">
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
      <v-icon class="drag-handle mr-3 ml-1">mdi-drag</v-icon>
    </v-toolbar>
    <div
      v-if="willShow(component, 'parent')"
      :class="{ 'v-container': editMode }"
    >
      <template v-if="editMode && $experiments.experiments.USER_V3_EDITOR">
        <v-card-subtitle class="mt-2">Dev UserV3 actions:</v-card-subtitle>
        <v-btn v-for="comp in components" @click="addItemDebug(comp.id)">
          Add {{ comp.name }}
        </v-btn>
      </template>
      <template v-else-if="editMode">
        <UserV3AddMenu :components="components" @add="addItemDebug"/>
      </template>
      <v-row class="c-both">
        <v-col
          v-for="child in component.props.children"
          :xl="12 / component.props.children.length"
          md="12"
        >
          <UserV3ComponentHandler
            :component="child"
            :components="components"
            :editMode="editMode"
            :gold="gold"
            :primary="primary"
            :user="user"
            :username="username"
            @delete="$emit('delete', $event)"
            @moveDown="$emit('moveDown', $event)"
            @moveUp="$emit('moveUp', $event)"
            @settings="$emit('settings', $event)"
          ></UserV3ComponentHandler>
        </v-col>
      </v-row>
    </div>
    <div
      v-else-if="willShow(component, 'spacer')"
      :style="{ height: component.props?.height + 'px' }"
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
      :gold="gold"
      :primary="primary"
      :user="user"
      :username="username"
    ></core-statistics>
    <LastFM
      v-else-if="willShow(component, 'last-fm')"
      :component="component"
      :user="user"
    />
    <my-anime-list
      v-else-if="willShow(component, 'mal')"
      :component="component"
      :user="user"
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
          :to="action"
          :v-bind="action"
        >
          {{ action.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </VErrorBoundary>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import MutualCollections from "@/components/Users/UserV3/Widgets/MutualCollections.vue"
import ProfileInfo from "@/components/Users/UserV3/Widgets/ProfileInfo.vue"
import MutualFriends from "@/components/Users/UserV3/Widgets/MutualFriends.vue"
import CoreStatistics from "@/components/Users/UserV3/Widgets/CoreStatistics.vue"
import LastFM from "@/components/Users/UserV3/Widgets/LastFM.vue"
import MyAnimeList from "@/components/Users/UserV3/Widgets/MyAnimeList.vue"
import VErrorBoundary from "@/components/Core/ErrorBoundary.vue"
import Crash from "@/components/Core/CrashAlt.vue"
import {Component} from "@/types/userv3"
import UserV3AddMenu from "@/components/Users/UserV3/AddMenu.vue"

export default defineComponent({
  name: "UserV3ComponentHandler",
  components: {
    UserV3AddMenu,
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
    }
  },
  methods: {
    addItemDebug(name: string) {
      this.$emit("addToParent", {
        name,
        id: this.$functions.uuid(),
        props: this.components.find((c) => c.id === name)?.props
      })
    },
    willShow(component: Component, name: string) {
      if (component.name !== name) return false
      if (
        component.props?.friendsOnly &&
        this.user?.friend !== "accepted" &&
        this.user?.id !== this.$user.user?.id
      )
        return false
      if (component.props?.mutualFriends && !this.user?.friends?.length)
        return false
      if (component.props?.mutualCollections && !this.user?.collections?.length)
        return false
      return true
    }
  }
})
</script>

<style scoped></style>
