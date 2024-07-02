<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{
        type === "api"
          ? $t("settings.security.addAPIKey")
          : $t("settings.security.addPassword")
      }}
    </template>
    <v-card-text v-if="!key">
      <v-text-field
        v-model="name"
        :autofocus="true"
        label="Name"
        required
        @keydown.enter="addAPIKey"
      />
      <v-text-field
        v-if="type === 'api'"
        v-model="expiry"
        disabled
        label="Expiry"
        readonly
      />
      <v-text-field
        v-if="type === 'password'"
        v-model="password"
        label="Password"
        type="password"
      />
      <overline>Select permissions</overline>
      {{ scopes }}
      <v-treeview
        :selected="scopes"
        :items="availableScopesNew"
        open-strategy="multiple"
        selectable
        select-strategy="classic"
        class="elevation-1"
        selected-color="primary"
        item-title="name"
        item-children="children"
        item-value="id"
        @update:selected="updateScopes"
      >
        <template #item="{ props }">
          <v-list-item>
            <v-list-item-title>
              <v-checkbox :model-value="scopes.includes(props.id)">
                {{ props.name }}
              </v-checkbox>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-treeview>
    </v-card-text>
    <v-card-text v-else>
      <v-text-field v-model="key" :disabled="true" label="Key" readonly />
      <p>
        Use this key with any TPU integrations. This is a secret, do not share
        it with anyone.
      </p>
    </v-card-text>
    <v-card-actions v-if="!key">
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        @click="type === 'api' ? addAPIKey() : addAlternatePassword()"
      >
        Add
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Close
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  components: { Overline, CoreDialog },
  props: ["modelValue", "type"],
  emits: ["update:modelValue", "create"],
  data() {
    return {
      availableScopes: [
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
        },
        {
          name: "User (View, Required)",
          id: "user.view"
        },
        {
          name: "User (Modify)",
          id: "user.modify"
        },
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
        },
        {
          name: "Starred Gallery (View)",
          id: "starred.view"
        },
        {
          name: "Starred Gallery (Modify)",
          id: "starred.modify"
        },
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
        },
        {
          name: "Chats (View)",
          id: "chats.view"
        },
        {
          name: "Chats (Send)",
          id: "chats.send"
        },
        {
          name: "Chats (Edit)",
          id: "chats.edit"
        },
        {
          name: "Chats (Create)",
          id: "chats.create"
        },
        {
          name: "Insights (View)",
          id: "insights.view"
        },
        {
          name: "Authorize TPU Applications",
          id: "oauth.authorize"
        }
      ],
      availableScopesNew: [
        {
          name: "Gallery & Starred",
          id: "uploads",
          children: [
            {
              name: "Uploads (Modify)",
              id: "uploads.modify"
            },
            {
              name: "Uploads (Create)",
              id: "uploads.create"
            },
            {
              name: "Uploads (View)",
              id: "uploads.view"
            },
            {
              name: "Starred Gallery (View)",
              id: "starred.view"
            },
            {
              name: "Starred Gallery (Modify)",
              id: "starred.modify"
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
        },
        {
          name: "Chats",
          id: "chats",
          children: [
            {
              name: "Chats (View)",
              id: "chats.view"
            },
            {
              name: "Chats (Send)",
              id: "chats.send"
            },
            {
              name: "Chats (Edit)",
              id: "chats.edit"
            },
            {
              name: "Chats (Create)",
              id: "chats.create"
            }
          ]
        },
        {
          name: "Insights",
          id: "insights",
          children: [
            {
              name: "Insights (View)",
              id: "insights.view"
            }
          ]
        },
        {
          name: "Applications",
          id: "oauth",
          children: [
            {
              name: "Authorize TPU Applications",
              id: "oauth.authorize"
            }
          ]
        }
      ],
      name: "",
      key: "",
      expiry: "",
      scopes: ["uploads.create", "user.view"],
      password: ""
    };
  },
  watch: {
    modelValue() {
      this.key = "";
      this.name = "";
      this.expiry = "";
      this.scopes = ["uploads.create", "user.view"];
    }
  },
  methods: {
    // Vuetify has no support for multiple selection in treeview
    updateScopes(value: string[]) {
      console.log(value);
      if (this.scopes.includes(value[0])) {
        this.scopes = this.scopes.filter((scope) => scope !== value[0]);
      } else {
        this.scopes.push(value[0]);
      }
    },
    async addAPIKey() {
      const { data } = await this.axios.post("/security/keys", {
        name: this.name,
        scopes: this.scopes,
        expiry: this.expiry
      });
      this.key = data.token;
      this.$emit("create", data);
    },
    async addAlternatePassword() {
      const { data } = await this.axios.post("/security/passwords", {
        name: this.name,
        scopes: this.scopes,
        password: this.password,
        totp: false
      });
      this.$emit("create", data);
      this.$emit("update:modelValue", false);
    }
  }
});
</script>
