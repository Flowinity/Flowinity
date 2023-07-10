<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Invite a Friend</template>
    <v-card-text>
      Enter your friends email, your invite will be sent to them after Troplo,
      or another TPU administrator approves it.
      <v-text-field
        v-model="email"
        :autofocus="true"
        :rules="$validation.user.email"
        label="Email"
        placeholder="troplo@troplo.com"
        required
        type="email"
        @keyup.enter="inviteFriend"
      ></v-text-field>
      <small>
        You will receive an email when your request is accepted or denied by a
        TPU administrator.
      </small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!email.length"
        class="rounded-xl"
        color="primary"
        @click="inviteFriend"
      >
        Invite
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "InviteAFriend",
  components: { CoreDialog },
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
