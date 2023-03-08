<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
  >
    <v-card color="#151515" class="text-center">
      <h1 class="mt-2">
        Introducing
        <span class="gold-text-gradient">TPU Gold</span>
      </h1>
      <p class="text-overline">Get access to¹:</p>
      <v-list style="background-color: #151515 !important">
        <v-list-item color="transparent">
          <v-list-item-title>
            <v-icon
              color="green"
              style="display: inline-block; position: relative; top: -0.75em"
              class="mr-2"
            >
              mdi-check
            </v-icon>
            <UserBadges
              class="justify-center"
              style="display: inline-block"
              :user="{
                id: $user.user?.id,
                username: 'Demo',
                plan: {
                  id: 6,
                  internalName: 'GOLD',
                  color: '#FFD700',
                  icon: 'mdi-plus',
                  name: 'Gold'
                }
              }"
            ></UserBadges>
            <span style="display: inline-block; position: relative; top: -1em">
              Swagger badge
            </span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Unlimited storage
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Historical Insights² (coming soon)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Custom accent color (coming soon)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Support TPU development
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
            A dynamic profile that reacts to your accent color
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Custom name color in Communications (coming soon)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon color="green">mdi-check</v-icon>
            Want to see a feature in Gold that isn't listed here? Let us know!
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <small>
        <sup>1</sup>
        Perks can be altered at any time without prior notice.
        <br />
        <sup>2</sup>
        Only includes historical insights for Weekly, Monthly and Annual
        reports, excludes the Dynamic report.
        <br />
        You can still view your current reports.
      </small>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red"
          text
          class="no-capital"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Close
        </v-btn>
        <span>
          <v-btn
            color="primary"
            text
            class="no-capital"
            @click="step++"
            disabled
          >
            Get started
            <v-icon class="ml-1">mdi-arrow-right</v-icon>
          </v-btn>
          <v-tooltip activator="parent" location="top">
            {{ $user.gold ? "You're already a Gold member!" : "Coming soon!" }}
          </v-tooltip>
        </span>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBadges from "@/components/Users/UserBadges.vue";

export default defineComponent({
  name: "GoldUpsell",
  components: { UserBadges },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      step: 1,
      geoSave: undefined as File[] | undefined,
      colubrina: {
        username: "",
        password: "",
        totp: "",
        loading: false
      }
    };
  },
  methods: {
    async checkColubrina() {
      this.colubrina.loading = true;
      try {
        await this.axios.post("/migrate/colubrina", {
          username: this.colubrina.username,
          password: this.colubrina.password,
          totp: this.colubrina.totp
        });
        if (this.$experiments.experiments["CLASSIC_MIGRATE"]) this.step++;
        else this.step = 8;
        this.colubrina.loading = false;
      } catch {
        this.colubrina.loading = false;
      }
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (!val) this.step = 1;
      }
    }
  }
});
</script>

<style scoped></style>
