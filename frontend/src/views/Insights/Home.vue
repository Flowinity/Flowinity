<template>
  <v-container>
    <CoreDialog v-model="comingSoon" max-width="500px">
      <template v-slot:title>Coming Soon</template>
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
    </CoreDialog>
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
              to="/insights/dynamic"
              image="https://i.troplo.com/i/3707e7de31bf.svg"
              :right-text="`Since ${$date($user.user?.createdAt).format(
                'YYYY'
              )}`"
            />
          </v-col>
          <v-col sm="1" cols="12" xl="3" md="6">
            <DynamicCard
              to="/insights/weekly"
              image="https://i.troplo.com/i/b95680817c90.svg"
              :right-text="`${$date()
                .subtract(7, 'days')
                .format('Do of MMMM YYYY')}`"
              :black-text="true"
            />
          </v-col>
          <v-col cols="12" sm="1" xl="3" md="6">
            <DynamicCard
              to="/insights/monthly"
              image="https://i.troplo.com/i/5804cb16c03e.svg"
              :right-text="`${$date()
                .subtract(30, 'days')
                .startOf('month')
                .format('MMMM YYYY')}`"
            />
          </v-col>
          <v-col cols="12" sm="1" xl="3" md="6">
            <DynamicCard
              to="/insights/yearly"
              image="https://i.troplo.com/i/283fd2159008.svg"
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
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "Home",
  components: { CoreDialog, DynamicCard },
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
