<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="text-center" color="#151515">
      <h1 class="mt-2">
        Introducing
        <span class="gold-text-gradient">Flowinity Pro</span>
      </h1>
      <p class="text-overline">Get access to¹:</p>
      <v-list style="background-color: #151515 !important">
        <v-list-item color="transparent">
          <v-list-item-title class="d-flex justify-center">
            <UserBadges
              :user="{
                id: $user.user?.id,
                username: 'Demo',
                plan: {
                  id: 6,
                  internalName: 'GOLD',
                  color: '#2396ff',
                  icon: 'mdi-plus',
                  name: 'Pro'
                }
              }"
            />
            <span>Swagger profile badge</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            100GB of storage, up from 10GB
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Custom Flowinity theme with the Theme Editor
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Support Flowinity development
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Early access to new features
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            A dynamic user profile that reacts to your theme
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Want to see a feature in Pro that isn't listed here? Let us know!
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <small>
        <sup>1</sup>
        Perks can be altered at any time without prior notice.
      </small>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="no-capital"
          color="red"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Close
        </v-btn>
        <span>
          <v-btn
            class="no-capital"
            color="primary"
            @click="startTrial"
            v-if="$app.activeNags.IAF_NAG"
          >
            Get your free month
            <v-icon class="ml-1">mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            class="no-capital"
            color="primary"
            href="https://github.com/sponsors/Flowinity"
            v-if="!$app.activeNags.IAF_NAG && !$user.gold"
          >
            Get started
            <v-icon class="ml-1">mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            class="no-capital"
            color="primary"
            to="/settings/subscriptions"
            v-else
          >
            Settings
          </v-btn>
        </span>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBadges from "@/components/Users/UserBadges.vue";

export default defineComponent({
  components: { UserBadges },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      step: 1
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (!val) this.step = 1;
      }
    }
  },
  methods: {
    startTrial() {
      this.$emit("update:modelValue", false);
      this.$app.dialogs.inviteAFriend = true;
    }
  }
});
</script>
