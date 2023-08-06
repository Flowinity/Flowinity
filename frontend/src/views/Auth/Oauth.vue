<template>
  <v-container class="center-container" :fluid="true">
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          v-if="app"
        >
          <p class="text-center text-gradient mb-n3" style="font-size: 64px">
            TPU
          </p>
          <p class="text-center text-grey">
            <v-avatar size="30" v-if="app.icon">
              <v-img
                :src="$app.site.hostnameWithProtocol + '/i/' + app.icon"
              ></v-img>
            </v-avatar>
            Continuing to {{ app.name }}
            <span v-if="app.verified">
              <v-tooltip location="top" activator="parent">
                Created by the TPU team
              </v-tooltip>
              <v-icon>mdi-check-circle</v-icon>
            </span>
          </p>
          <p class="text-center text-grey">
            {{ app.description }}
          </p>
          <v-list>
            <v-list-item
              v-for="scope in scopes"
              :key="scope.id"
              :value="scope.id"
              :disabled="true"
              style="opacity: 1"
            >
              <template v-slot:prepend>
                <v-icon color="green" class="ml-1 mr-4">
                  mdi-check-circle
                </v-icon>
              </template>
              <v-list-item-title
                style="text-overflow: unset; white-space: normal"
              >
                {{ scope.name }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="scope.description"
                style="
                  text-overflow: unset;
                  white-space: normal;
                  display: unset;
                "
              >
                {{ scope.description }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item :disabled="true" style="opacity: 1">
              <template v-slot:prepend>
                <v-icon color="red" class="ml-1 mr-4">mdi-close-circle</v-icon>
              </template>
              <v-list-item-title
                style="text-overflow: unset; white-space: normal"
              >
                Access your password
              </v-list-item-title>
              <v-list-item-subtitle
                style="
                  text-overflow: unset;
                  white-space: normal;
                  display: unset;
                "
              >
                This or any other apps cannot access your password or other
                sensitive information.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <small class="text-grey ml-5">
            You will be redirected to {{ url }} after authorizing.
          </small>
          <v-card-actions>
            <v-btn to="/login">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="authorize" :loading="loading">
              Authorize
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export type ScopeDefinition = {
  id: string;
  name: string;
  description?: string;
};

export default defineComponent({
  name: "Oauth",
  data() {
    return {
      app: null as any,
      scopesDefinitions: [] as ScopeDefinition[],
      loading: false
    };
  },
  computed: {
    url() {
      if (!this.app) return "";
      const url = new URL(this.app.redirectUri);
      return url.hostname;
    },
    scopes() {
      if (!this.app) return [];
      // split by comma, and get the scope definition
      return this.app.scopes.split(",").map((scope: string) => {
        const scopeDefinition = this.scopesDefinitions.find(
          (s: ScopeDefinition) => s.id === scope
        );
        return {
          id: scope,
          name: scopeDefinition ? scopeDefinition.name : scope,
          description: scopeDefinition ? scopeDefinition.description : null
        };
      });
    },
    appId() {
      return this.$route.params.oauthAppId || this.$route.query.client_id;
    }
  },
  methods: {
    async getAppData() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(`/oauth/${this.appId}`);
      this.app = data;
      this.$app.componentLoading = false;
      if (data.token) {
        window.location.href = `${this.app.redirectUri}?code=${data.token}&state=${this.$route.query.state}`;
      }
    },
    async getScopeDefinitions() {
      const { data } = await this.axios.get(`/oauth/scopeDefinitions`);
      this.scopesDefinitions = data;
    },
    async authorize() {
      this.loading = true;
      try {
        const { data } = await this.axios.post(
          `/oauth/${this.appId}/authorize`,
          {
            scopes: this.app.scopes
          }
        );
        window.location.href = `${this.app.redirectUri}?code=${data.token}&state=${this.$route.query.state}`;
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getAppData();
    this.getScopeDefinitions();
    if (!this.$user.user) {
      this.$router.push(
        "/login?redirect=" +
          this.$route.fullPath.replaceAll("?", "%3F").replaceAll("&", "%26")
      );
    }
  }
});
</script>

<style scoped></style>
