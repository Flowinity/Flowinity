<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>IP Whitelist</v-toolbar-title>
      </v-toolbar>
      <v-card-title v-if="!$app.site.connection?.whitelist">
        <v-alert type="warning" outlined variant="tonal">
          IP is not whitelisted.
        </v-alert>
      </v-card-title>
      <v-card-text v-else>
        <v-alert type="info" outlined variant="tonal">
          IP whitelist groups:
          <v-chip-group column>
            <v-chip
              v-if="$app.site.connection?.whitelist?.groups"
              v-for="group in $app.site.connection.whitelist.groups"
              :key="group"
            >
              {{ group }}
            </v-chip>
          </v-chip-group>
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminWhitelist"
});
</script>

<style scoped></style>
