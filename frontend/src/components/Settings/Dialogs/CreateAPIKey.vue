<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{ type === "api" ? "Add API Key" : "Add Alternate Password" }}
    </template>
    <v-card-text v-if="!key">
      <v-text-field
        v-model="name"
        :autofocus="true"
        label="Name"
        required
        @keydown.enter="addAPIKey"
      ></v-text-field>
      <v-text-field
        v-if="type === 'api'"
        v-model="expiry"
        disabled
        label="Expiry"
        readonly
      ></v-text-field>
      <v-text-field
        v-if="type === 'password'"
        v-model="password"
        label="Password"
        type="password"
      ></v-text-field>
      <v-select
        v-model="scopes"
        :items="availableScopes"
        item-title="name"
        item-value="id"
        label="Select"
        multiple
      ></v-select>
    </v-card-text>
    <v-card-text v-else>
      <v-text-field
        v-model="key"
        :disabled="true"
        label="Key"
        readonly
      ></v-text-field>
      <p>
        Use this key with any TPU integrations. This is a secret, do not share
        it with anyone.
      </p>
    </v-card-text>
    <v-card-actions v-if="!key">
      <v-spacer></v-spacer>
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
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Close
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "CreateAPIKey",
  components: { CoreDialog },
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
      name: "",
      key: "",
      expiry: "",
      scopes: ["uploads.create", "user.view"],
      password: ""
    };
  },
  methods: {
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
  },
  watch: {
    modelValue() {
      this.key = "";
      this.name = "";
      this.expiry = "";
      this.scopes = ["uploads.create", "user.view"];
    }
  }
});
</script>
