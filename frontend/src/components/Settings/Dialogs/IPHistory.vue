<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>IP History</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="history"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.date="{ item }">
            <span>{{ $date(item.date).format("DD/MM/YYYY hh:mm A") }}</span>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('update:modelValue', false)">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "IPHistory",
  props: ["modelValue", "history"],
  emits: ["update:modelValue"],
  data() {
    return {
      headers: [
        {
          title: "IP Address",
          key: "ip"
        },
        {
          title: "ISP",
          key: "isp"
        },
        {
          title: "ASN",
          key: "asn"
        },
        {
          title: "Location",
          key: "location"
        },
        {
          title: "Date",
          key: "date"
        }
      ]
    };
  }
});
</script>

<style scoped></style>
