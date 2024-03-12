<template>
  <v-alert class="gold-promo">
    <div class="d-flex">
      <v-icon v-if="!$user.user.subscription?.cancelled">
        mdi-check-circle
      </v-icon>
      <v-icon v-else>mdi-alert-circle</v-icon>

      <div class="ml-3" v-if="$user.user.subscription">
        <strong v-if="!$user.user.subscription.cancelled">
          You are subscribed to {{ $app.site.name }} {{ $user.user.plan.name }}!
        </strong>
        <strong v-else>
          Your {{ $app.site.name }} {{ $user.user.plan.name }} subscription has
          been cancelled.
        </strong>
        <p v-if="$user.user.subscription">
          Your {{ $user.user.plan.name }} will
          {{ $user.user.subscription.cancelled ? "expire" : "renew" }} on
          {{ dayjs($user.user.subscription.expiredAt).format("MMMM D, YYYY") }}.
        </p>
        <p v-if="$user.user.subscription.cancelled">
          Your subscription will not auto-renew.
        </p>
      </div>
      <div v-else class="ml-3">
        <strong>
          You have {{ $app.site.name }} {{ $user.user.plan.name }}
        </strong>
        <p>
          You have a legacy subscription that will never expire. Cancelling will
          instantly remove your subscription.
        </p>
      </div>
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
import dayjs from "@/plugins/dayjs";
</script>

<style scoped></style>
