<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Link new accounts</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <HoverChip
        v-for="integration in availableIntegrations"
        :color="integration.color"
        :short-text="integration.shortText"
        :text="integration.name"
        :href="integration.url"
        :disabled="!integration.available"
      ></HoverChip>
    </v-container>
  </v-card>
  <v-card class="mt-4">
    <v-toolbar>
      <v-toolbar-title>Manage linked accounts</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <!-- vuetify list of integrations from $user.user.integrations -->
      <v-list>
        <v-list-item
          v-for="integration in $user.user.integrations"
          :key="integration.id"
        >
          <v-list-item-title>
            {{ getIntegrationMeta(integration.type).name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ integration.providerUsername }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "Integrations",
  components: { HoverChip },
  data() {
    return {
      integrations: [] as {
        id: string;
        key: string;
        name: string;
      }[]
    };
  },
  computed: {
    availableIntegrations() {
      return [
        {
          id: "lastfm",
          name: "Last.fm",
          shortText: "Last.fm",
          color: "red",
          url: `https://www.last.fm/api/auth/?api_key=${this.getIntegrationKey(
            "lastfm"
          )}`,
          available: !!this.getIntegrationKey("lastfm")
        },
        {
          id: "mal",
          name: "MyAnimeList",
          shortText: "MAL",
          color: "#2e51a2",
          url: null,
          available: !!this.getIntegrationKey("mal")
        },
        {
          id: "discord",
          name: "Discord",
          shortText: "Discord",
          color: "#7289DA",
          url: null,
          available: !!this.getIntegrationKey("discord")
        },
        {
          id: "spotify",
          name: "Spotify",
          shortText: "Spotify",
          color: "#1DB954",
          url: null,
          available: !!this.getIntegrationKey("spotify")
        }
      ] as {
        id: string;
        name: string;
        shortText: string;
        color: string;
        url: string | null;
        available: boolean;
      }[];
    }
  },
  methods: {
    getIntegrationMeta(id: string) {
      return this.availableIntegrations.find((i) => i.id === id);
    },
    getIntegrationKey(provider: string) {
      return this.integrations.find((i) => i.id === provider)?.key;
    },
    async getIntegrations() {
      const { data } = await this.axios.get("/providers/linkable");
      this.integrations = data;
    }
  },
  mounted() {
    this.getIntegrations();
  }
});
</script>

<style scoped></style>
