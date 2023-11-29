<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="900px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>IP History</template>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="history"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:[`item.date`]="{ item }">
          <span>
            {{ $date(item.columns.date).format("DD/MM/YYYY hh:mm A") }}
          </span>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Close
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
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
