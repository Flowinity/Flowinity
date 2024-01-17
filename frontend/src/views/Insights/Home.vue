<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-spacer />
        <v-card-title>Insights</v-card-title>
        <v-spacer />
      </v-toolbar>
      <v-container class="text-center justify-center">
        <v-card-title>Welcome to the new Insights!</v-card-title>
        <v-card-subtitle class="mb-4">
          Select a report to gain detailed information on how you use Flowinity.
        </v-card-subtitle>
        <v-row>
          <v-col cols="12" md="6" sm="1" xl="3">
            <DynamicCard
              :right-text="`Since ${$date($user.user?.createdAt).format(
                'YYYY'
              )}`"
              image="https://i.troplo.com/i/113b798b50f9.svg"
              to="/insights/dynamic"
            />
          </v-col>
          <v-col cols="12" md="6" sm="1" xl="3">
            <DynamicCard
              :black-text="true"
              :right-text="`${$date()
                .subtract(7, 'days')
                .format('Do of MMMM YYYY')}`"
              image="https://i.troplo.com/i/ec511f6a168a.svg"
              to="/insights/weekly"
            />
          </v-col>
          <v-col cols="12" md="6" sm="1" xl="3">
            <DynamicCard
              :right-text="`${$date()
                .subtract(30, 'days')
                .startOf('month')
                .format('MMMM YYYY')}`"
              image="https://i.troplo.com/i/b93178346b36.svg"
              to="/insights/monthly"
            />
          </v-col>
          <v-col cols="12" md="6" sm="1" xl="3">
            <DynamicCard
              :right-text="`${$date()
                .subtract(1, 'years')
                .startOf('year')
                .format('YYYY')}`"
              image="https://i.troplo.com/i/4b18595e5bc2.svg"
              to="/insights/yearly"
            />
          </v-col>
          <!--          <v-col cols="12" sm="1" xl="6" md="6">
            <DynamicCard
              max-height="200px"
              to="/insights/yearly"
              image="https://i.troplo.com/i/283fd2159008.svg"
              :right-text="`${$date()
                .subtract(1, 'years')
                .startOf('year')
                .format('YYYY')}`"
            />
          </v-col>-->
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
  mounted() {
    this.$app.title = "Insights";
  }
});
</script>
