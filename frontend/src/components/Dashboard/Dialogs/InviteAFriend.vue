<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Invite a Friend</template>
    <v-card-text>
      <template v-if="$app.activeNags.IAF_NAG">
        <p v-if="!$user.gold">
          <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
          By inviting a friend to {{ $app.site.name }}, you will both get a free
          month of
          <span class="gold-text-gradient">Gold</span>
        </p>
        <p v-else>
          <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
          By inviting a friend to {{ $app.site.name }}, you will receive an
          additional free month of
          <span class="gold-text-gradient">Gold</span>
          and your friend will get a free month of
          <span class="gold-text-gradient">Gold</span>
        </p>
        <small>
          You will automatically be granted Flowinity Gold when the user
          registers. It will not auto-renew by default.
        </small>
      </template>
      <p
        class="mb-2"
        :class="{ 'mt-2': $app.activeNags.IAF_NAG && !$user.gold }"
      >
        Enter your friends email to invite them to
        {{ $app.site.name }} instantly!
      </p>
      <v-text-field
        v-model="email"
        :rules="$validation.user.email"
        :autofocus="true"
        label="Email"
        placeholder="troplo@troplo.com"
        required
        type="email"
        @keyup.enter="inviteFriend"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      email: ""
    };
  },
  watch: {
    modelValue() {
      this.email = "";
    }
  },
  methods: {
    async inviteFriend() {
      await this.axios.post("/invites", {
        email: this.email
      });
      if (this.$app.activeNags.IAF_NAG) {
        this.$experiments.setExperiment("IAF_NAG", 3);
      }
      this.$emit("update:modelValue", false);
      this.$toast.success("Invitation sent!");
    }
  }
});
</script>
