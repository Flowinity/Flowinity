<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Link new accounts</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <HoverChip
        v-for="integration in integrations"
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
        color: string;
        shortText: string;
        url: string;
        available: boolean;
      }[]
    };
  },
  methods: {
    getIntegrationMeta(id: string) {
      const integration = this.integrations.find((i) => i.id === id);
      if (!integration) {
        return {
          name: "Unknown",
          color: "grey",
          shortText: "Unknown",
          url: null,
          available: false
        };
      }
      return integration;
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
