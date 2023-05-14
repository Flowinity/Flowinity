<template>
  <v-card-text class="text-overline mb-n4">
    {{ $t("settings.domains.title") }}
  </v-card-text>
  <v-list>
    <v-list-item v-for="domain in domains" :key="domain.id">
      <v-list-item-title>
        {{ domain.domain }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{
          $t("settings.domains.users", {
            count: domain.activeUsersCount
          })
        }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-list-item-action>
          <v-btn
            @click="setDefault(domain.domain)"
            :disabled="$user.user?.domain.domain === domain.domain"
          >
            {{
              $user.user?.domain.domain === domain.domain
                ? "Current"
                : "Set Default"
            }}
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
  <small v-html="$t('settings.domains.disclaimer')"></small>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Domain } from "@/models/domain";

export default defineComponent({
  name: "Domains",
  data() {
    return {
      domains: [] as Domain[]
    };
  },
  methods: {
    async setDefault(domain: string) {
      if (!this.$user.user) return;
      await this.axios.patch("/user/domain", { domain });
      this.$user.user.domain.domain = domain;
    },
    async getDomains() {
      const { data } = await this.axios.get("/domains");
      this.domains = data;
    }
  },
  mounted() {
    this.getDomains();
  }
});
</script>

<style scoped></style>
