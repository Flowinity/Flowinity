<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.link") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <HoverChip
        v-for="integration in integrations"
        :color="integration.color"
        :disabled="!integration.available"
        :href="integration.url"
        :short-text="integration.shortText"
        :text="integration.name"
      ></HoverChip>
    </v-container>
  </v-card>
  <v-card v-if="$user.user.integrations.length" class="mt-4">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.manage") }}
      </v-toolbar-title>
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
          <v-list-item-subtitle>
            {{
              $t("settings.integrations.addedOn", {
                date: $date(integration.createdAt).format("MMMM Do YYYY")
              })
            }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon @click="removeIntegration(integration.id)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import HoverChip from "@/components/Core/HoverChip.vue"

export default defineComponent({
  name: "Integrations",
  components: {HoverChip},
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
      }[]
    }
  },
  methods: {
    async removeIntegration(id: number) {
      this.loading = true
      await this.axios.delete(`/providers/${id}`)
      await this.$user.init()
      this.loading = false
      this.$toast.success("Account unlinked from TPU.")
    },
    getIntegrationMeta(id: string) {
      const integration = this.integrations.find((i) => i.id === id)
      if (!integration) {
        return {
          name: "Unknown",
          color: "grey",
          shortText: "Unknown",
          url: null,
          available: false
        }
      }
      return integration
    },
    async getIntegrations() {
      const {data} = await this.axios.get("/providers/linkable")
      this.integrations = data
    }
  },
  mounted() {
    this.getIntegrations()
  }
})
</script>

<style scoped></style>
