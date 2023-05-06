<template>
  <CoreDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    v-if="$user.changes.profileLayout"
  >
    <template v-slot:title>Settings</template>
    <v-container>
      <v-switch
        v-model="$user.changes.profileLayout.config.showStatsSidebar"
        label="Stats sidebar"
        @change="
          $user.save();
          $emit('trigger');
        "
      />
    </v-container>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "UserV3Settings",
  components: { CoreDialog },
  props: ["modelValue", "user"]
});
</script>

<style scoped></style>
