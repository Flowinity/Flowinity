<template>
  <v-toolbar color="toolbar" class="rounded-xl">
    <CreateAPIKey v-model="dialogs.key" @create="getAPIKeys"></CreateAPIKey>
    <v-toolbar-title>API Keys</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="dialogs.key = true" text>
      <v-icon left>mdi-plus</v-icon>
      Add API Key
    </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="apiKeys">
    <template v-slot:item.actions="{ item }">
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
    <v-toolbar-title>Alternate Passwords</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="alternatePasswords.dialog = true" text>
      <v-icon left>mdi-plus</v-icon>
      Add Password
    </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="alternatePasswords.items">
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="deleteAlternatePassword(item.name)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <v-toolbar color="toolbar" class="rounded-xl mt-5">
    <v-toolbar-title>Recent Logins</v-toolbar-title>
  </v-toolbar>
  <v-list subheader three-line>
    <v-list-item v-for="login in sessions" :key="login.id">
      <v-list-item-title>
        {{ login.info?.accessedFrom?.at(-1)?.location || "Unknown Location" }}
      </v-list-item-title>
      <v-list-item-subtitle class="mt-1">
        {{ login.info?.accessedFrom?.at(-1)?.isp || "Unknown ISP" }}
        {{ login.info?.accessedFrom?.at(-1)?.asn || "Unknown ASN" }}
        -
        {{ login.info?.accessedFrom?.at(-1)?.ip || "Unknown IP" }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        Last session usage: {{ $date().to(login.updatedAt) }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        Session created: {{ $date().to(login.createdAt) }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="mt-1">
        Session expiry:
        {{ login.expiredAt ? $date().to(login.expiredAt) : "Never" }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn color="red" @click="deleteApiKey(login.id)" icon>
          <v-tooltip activator="parent" location="top">
            Delete Session
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
            <span v-if="login.info?.accessedFrom?.length">View IP History</span>
            <span v-else>Session has no IP history.</span>
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

export default defineComponent({
  name: "Security",
  components: { CreateAPIKey },
  data() {
    return {
      apiKeys: [],
      ipHistory: [],
      dialogs: {
        key: false,
        password: false,
        ipHistory: false
      },
      scopes: ["uploads.create", "user.view"],
      availableScopes: [
        {
          name: "Uploads",
          id: "uploads",
          children: [
            {
              name: "Uploads (Modify)",
              id: "uploads.modify"
            },
            {
              name: "Upload (Create)",
              id: "uploads.create"
            },
            {
              name: "Uploads (View)",
              id: "uploads.view"
            }
          ]
        },
        {
          name: "User",
          id: "user",
          children: [
            {
              name: "View UserInfo",
              id: "user.view"
            },
            {
              name: "User (Modify)",
              id: "user.modify"
            }
          ]
        },
        {
          name: "Collections",
          id: "collections",
          children: [
            {
              name: "Collections (Modify)",
              id: "collections.modify"
            },
            {
              name: "Collections (Create)",
              id: "collections.create"
            },
            {
              name: "Collections (View)",
              id: "collections.view"
            }
          ]
        },
        {
          name: "Workspaces",
          id: "workspaces",
          children: [
            {
              name: "Workspaces (Modify)",
              id: "workspaces.modify"
            },
            {
              name: "Workspaces (Create)",
              id: "workspaces.create"
            },
            {
              name: "Workspaces (View)",
              id: "workspaces.view"
            }
          ]
        }
      ],
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
        { title: "Actions", key: "actions", sortable: false }
      ],
      alternatePasswords: {
        dialog: false,
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
