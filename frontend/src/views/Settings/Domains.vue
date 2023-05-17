<template>
  <ModifyDomainDialog
    :type="edit.type"
    v-model="edit.dialog"
    @update="
      getDomains();
      $user.init();
    "
    :domain="edit.domain"
  />
  <v-card-text class="text-overline mb-n4">
    {{ $t("settings.domains.title") }}
    <v-btn
      icon
      size="x-small"
      v-if="$user.user?.administrator"
      @click="
        edit.dialog = true;
        edit.type === 'update';
      "
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
            icon
            size="x-small"
            v-if="$user.user?.administrator"
            :disabled="domain.id === 1"
            @click="deleteDomain(domain.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            size="x-small"
            v-if="$user.user?.administrator"
            @click="
              edit.type = 'update';
              edit.domain = domain;
              edit.dialog = true;
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            :disabled="$user.user?.domain?.domain === domain.domain"
            @click="setDefault(domain.domain)"
          >
            {{
              $user.user?.domain?.domain === domain.domain
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
import ModifyDomainDialog from "@/components/Admin/Domains/ModifyDomain.vue";

export default defineComponent({
  name: "Domains",
  components: { ModifyDomainDialog },
  data() {
    return {
      domains: [] as Domain[],
      edit: {
        domain: undefined as Domain | undefined,
        id: 0,
        type: "create",
        dialog: false
      }
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
    },
    async deleteDomain(id: number) {
      await this.axios.delete(`/admin/domain/${id}`);
      this.getDomains();
    }
  },
  mounted() {
    this.getDomains();
  }
});
</script>

<style scoped></style>
