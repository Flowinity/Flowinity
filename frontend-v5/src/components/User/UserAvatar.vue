<script setup lang="ts">
import TpuAvatar from "@/components/Framework/Avatar/TpuAvatar.vue";
import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useAppStore } from "@/stores/app.store";
import functions from "@/plugins/functions";

const props = defineProps({
  size: {
    default: 40,
    type: [Number, String]
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
  },
  status: {
    type: Boolean
  },
  badge: {
    type: [String, Number]
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
    <slot v-if="$slots.default" />
    <span style="font-size: 26px" v-else>
      {{ props.username?.charAt(0).toUpperCase() ?? "?" }}
    </span>
    <template #outer>
      <div
        v-if="props.status"
        class="status dark:border-sidebar-dark border-2"
        :style="{
          backgroundColor: functions.userStatus(user.status).color
        }"
        v-tooltip="functions.userStatus(user.status).text"
      ></div>
      <div
        v-if="props.badge"
        class="badge rounded-xl bg-red px-1"
        style="font-size: 11px"
      >
        {{ props.badge }}
      </div>
    </template>
  </tpu-avatar>
</template>

<style scoped>
.status {
  position: absolute;
  right: 0.1rem;
  bottom: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  z-index: 100;
  color: #ff6f66;
}

.badge {
  position: absolute;
  right: -0.3rem;
  top: 0;
  z-index: 100;
}
</style>
