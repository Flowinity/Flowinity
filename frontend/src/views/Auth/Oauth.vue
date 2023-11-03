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
          <p
            class="text-center text-gradient mt-2"
            :style="
              $vuetify.display.mobile ? 'font-size: 38px' : 'font-size: 48px'
            "
          >
            {{ $app.site?.name || "PrivateUploader" }}
          </p>
          <p class="text-center text-grey">
            <UserAvatar
              :user="{ username: app.name, avatar: app.icon }"
              v-if="app.icon"
              size="28"
              class="mr-2"
            />
            <template v-if="!bot">Continuing to {{ app.name }}</template>
            <template v-else>Add {{ app.bot.username }} to your chat.</template>
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
          <v-autocomplete
            :items="chats"
            item-title="name"
            item-value="association.id"
            v-model="selectedBotChat"
            label="Add to group"
            class="mx-6"
            v-if="bot"
          />
          <v-list>
            <v-list-item
              v-for="scope in scopes"
              :key="scope.id"
              :value="scope.id"
              :disabled="true"
              style="opacity: 1"
              v-if="!bot"
            >
              <template v-slot:prepend>
                <v-icon color="green" class="ml-4 mr-1">
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
            <v-list-item
              v-for="permission in permissions"
              :key="permission.id"
              :value="permission.id"
              :disabled="true"
              style="opacity: 1"
              v-else
            >
              <template v-slot:prepend>
                <v-icon color="green" class="ml-4 mr-1">
                  mdi-check-circle
                </v-icon>
              </template>
              <v-list-item-title
                style="text-overflow: unset; white-space: normal"
              >
                {{ permission.name }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="permission.description"
                style="
                  text-overflow: unset;
                  white-space: normal;
                  display: unset;
                "
              >
                {{ permission.description }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item :disabled="true" style="opacity: 1">
              <template v-slot:prepend>
                <v-icon color="red" class="ml-4 mr-1">mdi-close-circle</v-icon>
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
                No PrivateUploader app is able to access your password or other
                sensitive information.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <small class="text-grey ml-5">
            You will be redirected to {{ url || "privateuploader.com" }} after
            authorizing.
            <template v-if="!app.verified">
              This application is
              <b>not</b>
              endorsed, or published by PrivateUploader.
            </template>
          </small>
          <v-card-actions>
            <v-btn to="/login">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="bot ? addBot() : authorize()"
              :loading="loading"
              :disabled="bot && !selectedBotChat"
            >
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
import { ChatPermission, OauthApp } from "@/gql/graphql";
import {
  AddBotToChat,
  OauthAppConsentQuery
} from "@/graphql/developer/consent.graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export type ScopeDefinition = {
  id: string;
  name: string;
  description?: string;
};

export default defineComponent({
  name: "Oauth",
  components: { UserAvatar },
  data() {
    return {
      availablePermissions: [] as ChatPermission[],
      app: null as OauthApp | null,
      scopesDefinitions: [] as ScopeDefinition[],
      loading: false,
      selectedBotChat: null as number | null
    };
  },
  computed: {
    chats() {
      return this.$chat.chats.filter(
        (chat) =>
          chat.association.permissions.includes("ADMIN") ||
          chat.association.permissions.includes("MANAGE_INTEGRATIONS")
      );
    },
    permissions() {
      if (!this.bot || !this.$route.query.permissions) return [];
      try {
        const array = this.$route.query.permissions.split(",");
        return array.map((id) => {
          const foundPermission = this.availablePermissions.find(
            (permission) => permission.id === id
          );
          return foundPermission
            ? { ...foundPermission }
            : {
                name: id,
                id
              };
        });
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    permissionsMap() {
      return this.$route.query.permissions.split(",");
    },
    bot() {
      return this.$route.query.scope === "bot" && this.app.bot;
    },
    url() {
      try {
        if (!this.app) return "";
        const url = new URL(this.app.redirectUri);
        return url.hostname;
      } catch {
        return "";
      }
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
      const {
        data: { oauthAppConsent, availableChatPermissions }
      } = await this.$apollo.query({
        query: OauthAppConsentQuery,
        variables: {
          input: {
            id: this.appId
          }
        }
      });
      this.app = oauthAppConsent;
      this.availablePermissions = availableChatPermissions;
      this.$app.componentLoading = false;
      if (oauthAppConsent.token) {
        window.location.href = `${this.app.redirectUri}?code=${oauthAppConsent.token}&state=${this.$route.query.state}`;
      }
    },
    async getScopeDefinitions() {
      const { data } = await this.axios.get(`/oauth/scopeDefinitions`);
      this.scopesDefinitions = data;
    },
    async addBot() {
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: AddBotToChat,
          variables: {
            input: {
              permissions: this.permissionsMap,
              botAppId: this.app.id,
              associationId: this.selectedBotChat
            }
          }
        });
        this.$router.push(`/communications/${this.selectedBotChat}`);
      } finally {
        this.loading = false;
      }
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
