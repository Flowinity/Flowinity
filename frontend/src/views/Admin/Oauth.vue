<template>
  <component :is="$route.fullPath.startsWith('/admin') ? VContainer : 'div'">
    <CreateAppAuthDialog v-model="create"></CreateAppAuthDialog>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>My Applications</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="create = true">
          <v-tooltip activator="parent" location="bottom">Create app</v-tooltip>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container>
        <v-list>
          <v-list-item v-for="app in apps" :key="app.id">
            <v-img :src="app.icon"></v-img>
            <v-list-item-title>{{ app.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ app.description || "No description" }} -
              {{ app.user.username }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action>
                <v-btn
                  :to="`/admin/oauth/${app.id}`"
                  :disabled="app.userId != $user.user?.id"
                  color="primary"
                >
                  Manage
                </v-btn>
                <v-btn :to="`/oauth/${app.id}`">Login</v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateAppAuthDialog from "@/components/Admin/AppAuth/CreateAppAuthDialog.vue";
import { VContainer } from "vuetify/components";
import { MyAppsQuery } from "@/graphql/developer/myApps.graphql";

export default defineComponent({
  name: "AdminOAuth",
  computed: {
    VContainer() {
      return VContainer;
    }
  },
  components: { CreateAppAuthDialog },
  data() {
    return {
      apps: [],
      create: false
    };
  },
  methods: {
    async getAppAuth() {
      const {
        data: { devApps }
      } = await this.$apollo.query({
        query: MyAppsQuery
      });
      this.apps = devApps;
    }
  },
  mounted() {
    this.getAppAuth();
  },
  watch: {
    create() {
      this.getAppAuth();
    }
  }
});
</script>

<style scoped></style>
