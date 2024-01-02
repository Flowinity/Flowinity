<template>
  <tpu-dialog v-model="dialog">
    <template #toolbar>
      <slot name="toolbar" />
    </template>
    <div class="p-4">
      <slot name="content" />
      <div v-if="$slots.content" class="pb-4" />
      <danger-zone-input
        v-model:password="password"
        v-model:password-mode="passwordMode"
        :require-both="props.requireBoth"
        v-model:totp="totp"
        v-model:password-confirm="passwordConfirm"
        @confirm="confirmSubmit"
      ></danger-zone-input>
    </div>
    <div class="flex justify-end p-2 gap-2" v-if="$slots.actions">
      <slot name="actions" :confirm="confirmSubmit" />
    </div>
  </tpu-dialog>
  <slot :toggle="() => (dialog = !dialog)"></slot>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const props = defineProps({
  requireBoth: {
    type: Boolean,
    default: false
  }
});

const password = ref("");
const passwordConfirm = ref("");
const totp = ref("");
const passwordMode = ref(false);
const dialog = ref(false);

const emit = defineEmits(["confirm"]);
const toast = useToast();
const { t } = useI18n();

function confirmSubmit() {
  if ((props.requireBoth || passwordMode.value) && !password.value) {
    toast.error(t("dangerZone.passwordRequired"));
    return;
  }
  if ((props.requireBoth || !passwordMode.value) && !totp.value) {
    toast.error(t("dangerZone.totpRequired"));
    return;
  }
  if (
    (props.requireBoth || passwordMode.value) &&
    password.value !== passwordConfirm.value
  ) {
    toast.error(t("dangerZone.passwordMismatch"));
    return;
  }
  emit("confirm", {
    password: password.value,
    totp: totp.value,
    passwordMode: passwordMode.value
  });
}
</script>

<style scoped></style>
