<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Invite a Friend</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        Enter your friends email, your invite will be sent to them after Troplo,
        or another TPU administrator approves it.
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
          placeholder="troplo@troplo.com"
          autofocus
          @keyup.enter="inviteFriend"
          :rules="$validation.user.email"
        ></v-text-field>
        <small>
          You will receive an email when your request is accepted or denied by a
          TPU administrator.
          <br />
          Your friend will not use Flowinity SSO to authenticate.
        </small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          class="rounded-xl"
          :disabled="!email.length"
          @click="inviteFriend"
        >
          Invite
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InviteAFriend",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      email: ""
    };
  },
  methods: {
    async inviteFriend() {
      await this.axios.post("/invites", {
        email: this.email
      });
      this.$emit("update:modelValue", false);
      this.$toast.success("Request received!");
    }
  },
  watch: {
    modelValue() {
      this.email = "";
    }
  }
});
</script>

<style scoped></style>
