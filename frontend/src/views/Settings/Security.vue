<template>
  <v-toolbar color="toolbar" class="rounded-xl">
    <CreateAPIKey
      type="api"
      v-model="dialogs.key"
      @create="getAPIKeys"
    ></CreateAPIKey>
    <v-toolbar-title>
      {{ $t("settings.security.apiKeys") }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="dialogs.key = true">
      <v-icon left>mdi-plus</v-icon>
      {{ $t("settings.security.addAPIKey") }}
    </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="apiKeys">
    <template v-slot:item.actions="{ item }">
      <v-icon
        @click="
          ipHistory = item.props.title.info?.accessedFrom;
          dialogs.ipHistory = true;
        "
        class="mr-3"
        :disabled="!item.props.title.info?.accessedFrom.length"
      >
        <v-tooltip activator="parent" location="top">
          <span v-if="item.info?.accessedFrom?.length">
            {{ $t("settings.security.ipHistory") }}
          </span>
          <span v-else>
            {{ $t("settings.security.noIPHistory") }}
          </span>
        </v-tooltip>
        mdi-web
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="$functions.copy(item.props.title.token)"
      >
        mdi-content-copy
      </v-icon>
      <v-icon small class="mr-2" @click="deleteApiKey(item.props.title.id)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <v-toolbar color="toolbar" class="rounded-xl mt-5">
    <CreateAPIKey
      v-model="dialogs.password"
      @create="getAlternatePasswords"
      type="password"
    ></CreateAPIKey>
    <v-toolbar-title>
      {{ $t("settings.security.alternatePasswords") }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="dialogs.password = true">
      <v-icon left>mdi-plus</v-icon>
      {{ $t("settings.security.addAlternatePassword") }}
    </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="alternatePasswords.items">
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="deleteAlternatePassword(item.props.title.name)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <v-toolbar color="toolbar" class="rounded-xl mt-5">
    <v-toolbar-title>
      {{ $t("settings.security.recentLogins") }}
    </v-toolbar-title>
  </v-toolbar>
  <v-list subheader three-line>
    <IPHistory :history="ipHistory" v-model="dialogs.ipHistory" />
    <v-list-item v-for="login in sessions" :key="login.id">
      <v-list-item-title>
        {{
          login.info?.accessedFrom?.at(-1)?.location ||
          $t("settings.security.unknownLocation")
        }}
      </v-list-item-title>
      <v-list-item-subtitle class="mt-1">
        {{
          login.info?.accessedFrom?.at(-1)?.isp ||
          $t("settings.security.unknownISP")
        }}
        {{
          login.info?.accessedFrom?.at(-1)?.asn ||
          $t("settings.security.unknownASN")
        }}
        -
        {{
          login.info?.accessedFrom?.at(-1)?.ip ||
          $t("settings.security.unknownIP")
        }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        {{
          $t("settings.security.lastSessionUsage", {
            date: $date().to(login.createdAt)
          })
        }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        {{
          $t("settings.security.sessionCreated", {
            date: $date().to(login.createdAt)
          })
        }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        {{
          $t("settings.security.sessionExpiry", {
            date: login.expiredAt
              ? $date().to(login.expiredAt)
              : $t("generic.never")
          })
        }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn color="red" @click="deleteApiKey(login.id)" icon>
          <v-tooltip activator="parent" location="top">
            {{ $t("settings.security.deleteSession") }}
          </v-tooltip>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          color="blue"
          @click="
            ipHistory = login.info?.accessedFrom;
            dialogs.ipHistory = true;
          "
          icon
          :disabled="!login.info?.accessedFrom?.length"
        >
          <v-tooltip activator="parent" location="top">
            <span v-if="login.info?.accessedFrom?.length">
              {{ $t("settings.security.ipHistory") }}
            </span>
            <span v-else>
              {{ $t("settings.security.noIPHistory") }}
            </span>
          </v-tooltip>
          <v-icon>mdi-web</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateAPIKey from "@/components/Settings/Dialogs/CreateAPIKey.vue";
import IPHistory from "@/components/Settings/Dialogs/IPHistory.vue";

export default defineComponent({
  name: "Security",
  components: { IPHistory, CreateAPIKey },
  data() {
    return {
      apiKeys: [],
      ipHistory: [],
      dialogs: {
        key: false,
        password: false,
        ipHistory: false
      },
      headers: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Scopes",
          key: "scopes"
        },
        {
          title: "Expiry",
          key: "expiry"
        },
        {
          title: "Created At",
          key: "createdAt"
        },
        { title: "Actions", key: "actions" }
      ],
      alternatePasswords: {
        items: []
      },
      sessions: [] as any[]
    };
  },
  methods: {
    async getAPIKeys() {
      const { data } = await this.axios.get("/security/keys");
      this.apiKeys = data;
    },
    async getAlternatePasswords() {
      const { data } = await this.axios.get("/security/passwords");
      this.alternatePasswords.items = data;
    },
    async deleteApiKey(id: number) {
      await this.axios.delete(`/security/keys/${id}`);
      this.getAPIKeys();
      this.getSessions();
    },
    async deleteAlternatePassword(name: string) {
      await this.axios.patch(`/security/passwords`, {
        name
      });
      this.getAlternatePasswords();
    },
    async getSessions() {
      const { data } = await this.axios.get("/security/logins");
      this.sessions = data;
    }
  },
  mounted() {
    this.getAPIKeys();
    this.getAlternatePasswords();
    this.getSessions();
  }
});
</script>

<style scoped></style>
