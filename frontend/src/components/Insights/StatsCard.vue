<template>
  <v-card class="text-center">
    <v-container>
      <strong style="font-size: 24px" class="text-gradient">{{ title }}</strong>
      <p class="text-grey" style="font-size: 14px" v-if="subtitle">
        {{ subtitle }}
      </p>
      <h1 style="font-size: 5em" v-if="count">{{ count }}</h1>
      <slot v-else></slot>
      <v-card-subtitle style="margin-top: -35px" v-if="difference">
        <v-icon :color="differenceIcon(difference).color">
          {{ differenceIcon(difference).icon }}
        </v-icon>
        {{ difference?.toString().replace("-", "") }}
      </v-card-subtitle>
      <v-card-subtitle style="margin-top: -25px" v-if="last">
        {{ last }} previously
      </v-card-subtitle>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InsightsStatsCard",
  props: {
    subtitle: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: false
    },
    difference: {
      type: Number,
      required: false
    },
    last: {
      type: Number,
      required: false
    }
  },
  methods: {
    differenceIcon(diff: number, reverse = false) {
      if (!reverse) {
        if (diff > 0) {
          return {
            icon: "mdi-arrow-up-circle",
            color: "success"
          };
        } else if (diff < 0) {
          return {
            icon: "mdi-arrow-down-circle",
            color: "red"
          };
        } else {
          return {
            icon: "mdi-minus-circle",
            color: "warning"
          };
        }
      } else {
        if (diff > 0) {
          return {
            icon: "mdi-arrow-up-circle",
            color: "red"
          };
        } else if (diff < 0) {
          return {
            icon: "mdi-arrow-down-circle",
            color: "success"
          };
        } else {
          return {
            icon: "mdi-minus-circle",
            color: "warning"
          };
        }
      }
    }
  }
});
</script>

<style scoped></style>
