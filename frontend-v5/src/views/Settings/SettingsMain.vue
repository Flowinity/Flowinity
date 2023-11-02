<template>
  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <span
        v-tooltip.bottom="
          userStore.updatingUser
            ? t('settings.actionBar.saving')
            : t('settings.actionBar.saved')
        "
        v-if="userStore.updatingUser || checkbox"
      >
        <tpu-button :disabled="true" icon variant="passive">
          <tpu-spinner :size="24" v-if="userStore.updatingUser" />
          <RiCheckLine v-else-if="checkbox" style="width: 24px"></RiCheckLine>
        </tpu-button>
      </span>
    </transition>
  </teleport>
  <router-view />
</template>

<script setup lang="ts">
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import TpuSpinner from "@/components/Framework/Spinner/TpuSpinner.vue";
import { useUserStore } from "@/stores/user.store";
import { ref, watch } from "vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const checkbox = ref(false);
const { t } = useI18n();
let timeout: number = 0;

watch(
  () => userStore.updatingUser,
  (val) => {
    if (!val) {
      clearTimeout(timeout);
      checkbox.value = true;
      timeout = setTimeout(() => {
        checkbox.value = false;
      }, 2000);
    }
  }
);
</script>

<style scoped></style>
