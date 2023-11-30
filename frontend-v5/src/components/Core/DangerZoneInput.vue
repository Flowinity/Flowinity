<template>
  <text-field
    v-if="userStore.user?.totpEnable && !passwordMode"
    :label="$t('generic.dangerZone.totp')"
    autofocus
    :model-value="totp"
    parent-classes="flex-col"
    @keydown.enter="$emit('confirm')"
    @update:model-value="$emit('update:totp', $event)"
  >
    <div class="flex justify-end">
      <a
        class="select-none cursor-pointer text-blue"
        @click="$emit('update:passwordMode', true)"
      >
        {{ $t("generic.dangerZone.usePassword") }}
      </a>
    </div>
  </text-field>
  <text-field
    v-else
    :label="$t('generic.dangerZone.password')"
    autofocus
    type="password"
    :model-value="password"
    parent-classes="flex-col"
    @keydown.enter="$emit('confirm')"
    @update:model-value="$emit('update:password', $event)"
  >
    <div v-if="userStore.user?.totpEnable" class="flex justify-end">
      <a
        class="select-none cursor-pointer text-blue"
        @click="$emit('update:passwordMode', false)"
      >
        {{ $t("generic.dangerZone.useTotp") }}
      </a>
    </div>
  </text-field>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { useUserStore } from "@/stores/user.store";
import { onMounted } from "vue";
const userStore = useUserStore();
const props = defineProps({
  password: String,
  totp: String,
  passwordMode: Boolean,
  requireBoth: Boolean
});
const emit = defineEmits([
  "update:password",
  "update:totp",
  "update:passwordMode",
  "confirm"
]);

onMounted(() => {
  if (!userStore.user?.totpEnable) {
    emit("update:passwordMode", true);
  }
});
</script>

<style scoped></style>
