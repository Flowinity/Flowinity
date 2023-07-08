<template>
  <CoreDialog :eager="true" :model-value="true" max-width="900px">
    <template v-slot:title>
      {{ $t("core.privacy.title") }}
    </template>
    <p class="mx-4">
      {{ $t("core.privacy.desc") }}
    </p>
    <v-divider></v-divider>
    <PrivacyPolicy class="mx-4 mt-n11 mb-n16"></PrivacyPolicy>
    <v-btn
      style="z-index: 9999"
      @click="
        $user.changes.privacyPolicyAccepted = true;
        $user.save();
      "
    >
      {{ $t("core.privacy.close") }}
    </v-btn>
  </CoreDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import PrivacyPolicy from "@/views/Policies/Privacy.vue";

export default defineComponent({
  name: "PrivacyPolicyDialog",
  components: {PrivacyPolicy, CoreDialog}
});
</script>

<style scoped></style>
