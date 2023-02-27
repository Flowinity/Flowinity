<template>
  <v-container>
    <v-dialog v-model="comingSoon" max-width="500px">
      <v-card>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-card-title>Coming Soon</v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container class="text-center justify-center">
          <v-card-text>
            This feature is coming soon! If you'd still like to access your
            Insights, you can do so on the
            <a
              href="https://legacy.images.flowinity.com/insights"
              target="_blank"
            >
              old TPU.
            </a>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
    <v-card>
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-card-title>Insights</v-card-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container class="text-center justify-center">
        <v-card-title>Welcome to the new Insights!</v-card-title>
        <v-card-subtitle class="mb-4">
          Select a report to gain detailed information on how you use TPU.
        </v-card-subtitle>
        <v-row>
          <v-col cols="12" sm="1" xl="3" md="6">
            <DynamicCard
              @click="comingSoon = true"
              image="https://i.troplo.com/i/7c28a218cb93.png"
              :right-text="`Since ${$date($user.user?.createdAt).format(
                'YYYY'
              )}`"
            />
          </v-col>
          <v-col sm="1" cols="12" xl="3" md="6">
            <DynamicCard
              @click="comingSoon = true"
              image="https://i.troplo.com/i/96837edd30ab.png"
              :right-text="`${$date()
                .subtract(7, 'days')
                .format('Do of MMMM YYYY')}`"
              :black-text="true"
            />
          </v-col>
          <v-col cols="12" sm="1" xl="3" md="6">
            <DynamicCard
              @click="comingSoon = true"
              image="https://i.troplo.com/i/12c3b4f1a171.png"
              :right-text="`${$date()
                .subtract(30, 'days')
                .startOf('month')
                .format('MMMM YYYY')}`"
            />
          </v-col>
          <v-col cols="12" sm="1" xl="3" md="6">
            <DynamicCard
              @click="comingSoon = true"
              image="https://i.troplo.com/i/aee5a39b685b.png"
              :right-text="`${$date()
                .subtract(1, 'years')
                .startOf('year')
                .format('YYYY')}`"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DynamicCard from "@/components/Core/DynamicCard.vue";

export default defineComponent({
  name: "Home",
  components: { DynamicCard },
  data() {
    return {
      comingSoon: false
    };
  },
  mounted() {
    this.$app.title = "Insights";
  }
});
</script>

<style scoped></style>
