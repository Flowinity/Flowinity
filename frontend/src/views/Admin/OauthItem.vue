<template>
  <v-container v-if="app">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ app.name }}</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <div class="d-flex align-center mb-4">
          <v-avatar size="128">
            <v-img
              :src="
                app.icon
                  ? $app.domain + app.icon
                  : 'https://i.troplo.com/i/50ba79e4.png'
              "
              width="128"
            ></v-img>
          </v-avatar>
          <v-card-text class="ml-n4">
            <div class="d-flex flex-column flex-grow-1 justify-center">
              <v-card-title>
                {{ app.name }}
                <span v-if="app.verified">
                  <v-tooltip location="top" activator="parent">
                    Created by the TPU team
                  </v-tooltip>
                  <v-icon color="grey">mdi-check-circle</v-icon>
                </span>
              </v-card-title>
              <v-card-subtitle>
                {{ app.description || "No description" }}
              </v-card-subtitle>
              <v-card-subtitle>by {{ app.user.username }}</v-card-subtitle>
            </div>
          </v-card-text>
        </div>
        <template v-if="app.private">
          <v-text-field
            label="Username"
            v-model="username"
            @keyup.enter="addUser()"
          >
            <template v-slot:append>
              <v-btn color="primary" :loading="loading" @click="addUser()">
                Add User
              </v-btn>
            </template>
          </v-text-field>
          <v-data-table :headers="headers" :items="app.oauthUsers">
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="addUser(item.raw.user.username)" color="red">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </v-container>
      <v-card-text v-if="app.userId === $user.user?.id">
        <v-form class="d-flex flex-column">
          <v-text-field
            v-model="app.name"
            label="Name"
            outlined
            dense
            required
            :rules="[
              (v) => !!v || 'Name is required',
              (v) => v.length <= 32 || 'Name must be less than 32 characters'
            ]"
          ></v-text-field>
          <v-text-field
            v-model="app.description"
            label="Description"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            placeholder="https://i.troplo.com/i/50ba79e4.png"
            v-model="app.icon"
            label="Icon"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="app.redirectUri"
            label="Redirect"
            outlined
            dense
            required
            :rules="[(v) => !!v || 'Redirect is required']"
            placeholder="https://oci3.troplo.com/tpu_callback"
          ></v-text-field>
          <v-checkbox
            v-model="app.private"
            label="Private"
            dense
            required
            persistent-hint
            hint="Private apps can only be used by the owner or manually added users"
          ></v-checkbox>
          <v-checkbox
            v-model="app.verified"
            label="Verified"
            dense
            required
            hint="Only use this for public facing and TPU endorsed apps"
            persistent-hint
          ></v-checkbox>
          <v-expansion-panels class="my-2">
            <v-expansion-panel title="Scopes">
              <template v-slot:text>
                <v-container class="my-2">
                  <v-checkbox
                    v-for="scope in scopesDefinitions"
                    v-model="scopes"
                    :value="scope.id"
                    :label="scope.name"
                    :hint="scope.description"
                    persistent-hint
                    class="mt-n8"
                  ></v-checkbox>
                </v-container>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn color="primary" @click="updateAppAuth" :loading="loading">
            Save
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-text>
        <v-card-title>Configuring your app</v-card-title>
        <v-card-text>
          <strong>NGINX:</strong>
          <ol>
            <li>
              Download
              <a href="https://github.com/PrivateUploader/nginx-auth">
                nginx auth scripts
              </a>
              (tpu.conf and tpu.js) and put them in /etc/nginx
            </li>
            <li>
              Download the NGINX NJS module and add
              <code>
                load_module /usr/lib/nginx/modules/ngx_http_js_module.so;
              </code>
              (replace path if needed) to the top of your nginx.conf
            </li>
            <li>
              Additionally add
              <code>
                proxy_cache_path /etc/nginx/auth_cache levels=1:2
                keys_zone=auth_cache:1m max_size=1g inactive=60m;
              </code>
              to the http directive
            </li>
            <li>
              Add
              <code>set $tpu_app_id "{{ app.id }}";</code>
              and
              <code>include tpu.conf;</code>
              above the location directives you want to protect.
            </li>
            <li>
              Add
              <br />
              <code>
                error_page 500 https://privateuploader.com/oauth/$tpu_app_id;
                <br />
                auth_request /_tpu_get_user;
              </code>
              <br />
              inside the location directives you want to protect.
            </li>
            <li>You're done!</li>
          </ol>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ScopeDefinition } from "@/views/Auth/Oauth.vue";
import { OauthApp } from "@/models/oauthApp";

export default defineComponent({
  name: "AdminWhitelist",
  data() {
    return {
      app: null as OauthApp | null,
      username: "",
      loading: false,
      scopesDefinitions: [] as ScopeDefinition[],
      headers: [
        {
          title: "Username",
          key: "user.username"
        },
        {
          title: "Created",
          key: "createdAt"
        },
        {
          title: "Active",
          key: "active"
        },
        {
          title: "Actions",
          key: "actions"
        }
      ]
    };
  },
  computed: {
    scopes: {
      get() {
        // convert "scope1,scope2" to ["scope1", "scope2"]
        return this.app.scopes.split(",");
      },
      set(value: string[]) {
        // convert ["scope1", "scope2"] to "scope1,scope2"
        this.app.scopes = value.join(",");
      }
    }
  },
  methods: {
    async getScopeDefinitions() {
      const { data } = await this.axios.get(`/oauth/scopeDefinitions`);
      this.scopesDefinitions = data;
    },
    async getAppAuth() {
      try {
        this.$app.componentLoading = true;
        const { data } = await this.axios.get(
          `/admin/oauth/${this.$route.params.id}`
        );
        this.app = data;
      } finally {
        this.$app.componentLoading = false;
      }
    },
    async updateAppAuth() {
      try {
        this.loading = true;
        await this.axios.put(`/admin/oauth/${this.$route.params.id}`, {
          ...this.app
        });
        this.$toast.success("App updated");
      } finally {
        this.loading = false;
      }
    },
    async addUser(username?: string) {
      try {
        this.loading = true;
        await this.axios.post(`/admin/oauth/${this.$route.params.id}/user`, {
          username: username || this.username
        });
        this.$toast.success("User configuration updated");
      } finally {
        this.loading = false;
        this.getAppAuth();
        this.username = "";
      }
    }
  },
  mounted() {
    this.getAppAuth();
    this.getScopeDefinitions();
  },
  watch: {
    create() {
      this.getAppAuth();
    }
  }
});
</script>

<style scoped></style>
