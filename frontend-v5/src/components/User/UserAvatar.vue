<script setup lang="ts">
import TpuAvatar from "@/components/Core/Avatar/TpuAvatar.vue";
import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";
import functions from "@/plugins/functions";

const props = defineProps({
  size: {
    default: 40,
    type: Number
  },
  src: {
    type: String
  },
  color: {
    type: String
  },
  alt: {
    type: String
  },
  userId: {
    type: Number
  },
  username: {
    type: String
  }
});
const userStore = useUserStore();
const appStore = useAppStore();

const user = computed(() => {
  return (
    userStore.users[props.userId] || {
      username: props.username,
      id: props.userId
    }
  );
});
</script>

<template>
  <tpu-avatar
    :alt="props.alt || props.username"
    :color="src ? undefined : functions.avatar(user) ? undefined : true"
    :size="size"
    :src="src ? src : user.avatar ? functions.avatar(user) : undefined"
  >
    <template #default v-if="$slots.default">
      <slot />
    </template>
    <template #default v-else>
      <span style="font-size: 26px">
        {{ props.username?.charAt(0).toUpperCase() ?? "?" }}
      </span>
    </template>
  </tpu-avatar>
</template>

<style scoped></style>
