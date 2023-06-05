<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.link") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <div>
        <span v-for="integration in integrations">
          <v-tooltip
            :text="`${
              ($user.user.integrations.find((i) => i.type === integration.id)
                ? 'Already Linked'
                : null) ||
              (!integration.available ? 'Unavailable' : 'Available')
            }`"
            location="top"
            activator="parent"
          />
          <v-chip
            :color="integration.color"
            :disabled="
              !!(
                !integration.available ||
                $user.user.integrations.find((i) => i.type === integration.id)
              )
            "
            :href="integration.url"
            :short-text="integration.shortText"
            :icon="`si:${integration.icon}`"
          />
        </span>
      </div>
    </v-container>
  </v-card>
  <v-card v-if="$user.user.integrations.length" class="mt-4">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.manage") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-list>
        <v-list-item
          v-for="integration in $user.user.integrations"
          :key="integration.id"
        >
          <v-list-item-title>
            <v-icon>si:{{ getIntegrationMeta(integration.type).icon }}</v-icon>
            {{ getIntegrationMeta(integration.type).name }}
            <v-btn
              v-if="integration.error"
              class="ml-1"
              color="red"
              icon
              size="x-small"
              variant="tonal"
            >
              <v-icon left>mdi-alert</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ integration.error }}
              </v-tooltip>
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ integration.providerUsername
            }}{{
              integration.providerUserCache?.discriminator
                ? "#" + integration.providerUserCache?.discriminator
                : ""
            }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{
              $t("settings.integrations.addedOn", {
                date: $date(integration.createdAt).format("MMMM Do YYYY")
              })
            }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon @click="removeIntegration(integration.type)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
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
      loading: false,
      integrations: [] as {
        id: string;
        key: string;
        name: string;
        color: string;
        shortText: string;
        url: string;
        available: boolean;
        icon: string;
      }[]
    };
  },
  methods: {
    async removeIntegration(type: string) {
      this.loading = true;
      await this.axios.delete(`/providers/unlink/${type}`);
      await this.$user.init();
      this.loading = false;
      this.$toast.success("Third-party account integration removed!");
    },
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
