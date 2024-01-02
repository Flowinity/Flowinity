<template>
  <CoreDialog max-width="900px" :model-value="true" :eager="true">
    <template #title>
      {{ $t("core.privacy.title") }}
    </template>
    <p class="mx-4">
      {{ $t("core.privacy.desc") }}
    </p>
    <v-divider />
    <PrivacyPolicy class="mx-4 mt-n11 mb-n16" />
    <v-btn
      style="z-index: 9999"
      @click="
        $user.user.privacyPolicyAccepted = true;
        $user.save();
      "
    >
      {{ $t("core.privacy.close") }}
    </v-btn>
  </CoreDialog>
</template>

<script lang="ts" setup>
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import PrivacyPolicy from "@/views/Policies/Privacy.vue";
</script>
