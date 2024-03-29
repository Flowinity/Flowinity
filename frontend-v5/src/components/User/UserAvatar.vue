<template>
  <div class="relative" :class="{ 'cursor-pointer': edit }">
    <teleport v-if="edit" to="#main-area">
      <set-picture-dialog
        v-model="editing"
        @set-image="
          $emit('setImage', $event, () => {
            editing = false;
          })
        "
      />
    </teleport>
    <tpu-hover v-slot="{ hovering }">
      <tpu-overlay
        :overlay-classes="{ 'rounded-full': true }"
        absolute
        :model-value="hovering && edit"
        @click="editing = true"
      >
        <RiUploadLine style="width: 40px" />
      </tpu-overlay>
      <tpu-avatar
        :alt="props.alt || props.username"
        :color="
          src || avatar ? undefined : functions.avatar(user) ? undefined : true
        "
        :size="size"
        :src="
          src
            ? src
            : user.avatar
              ? functions.avatar(user)
              : avatar
                ? appStore.domain + avatar
                : undefined
        "
        style="z-index: 0"
      >
        <slot v-if="$slots.default" />
        <span v-else style="font-size: 26px">
          {{ props.username?.charAt(0).toUpperCase() ?? "?" }}
        </span>
        <template #outer>
          <div
            v-if="props.status"
            v-tooltip="functions.userStatus(user.status).text"
            class="status dark:border-sidebar-dark border-2 fill-black flex items-center justify-center relative"
            :style="{
              backgroundColor:
                user.status === UserStatus.Idle && !typing
                  ? '#101113'
                  : functions.userStatus(user.status).color
            }"
            :class="{ 'typing-status': typing }"
          >
            <transition name="scale-transition">
              <template v-if="!typing">
                <div
                  v-if="user.status === UserStatus.Busy"
                  style="height: 2px; width: 6px; background: #101113"
                  class="rounded"
                />
                <RiMoonFill
                  v-else-if="user.status === UserStatus.Idle"
                  style="
                    height: 8px;
                    width: 8px;
                    stroke-width: 1px;
                    transform: rotate(-90deg);
                  "
                  :style="{
                    strokeColor: functions.userStatus(user.status).color,
                    fill: functions.userStatus(user.status).color
                  }"
                  class="rounded"
                />
                <RiCheckLine
                  v-else-if="user.status === UserStatus.Online"
                  style="height: 8px; width: 8px"
                  class="rounded"
                />
                <div
                  v-else
                  style="height: 4.5px; width: 4.5px; background: #101113"
                  class="rounded"
                />
              </template>
              <template v-else>
                <div class="inline-flex items-center justify-center">
                  <div class="dot" style="margin-right: 2px"></div>
                  <div class="dot" style="margin-right: 2px"></div>
                  <div class="dot"></div>
                </div>
              </template>
            </transition>
          </div>
          <div
            v-if="props.badge"
            class="badge rounded-xl bg-red px-1"
            style="font-size: 11px"
          >
            {{ props.badge }}
          </div>
        </template>
      </tpu-avatar>
    </tpu-hover>
  </div>
</template>

<script setup lang="ts">
import TpuAvatar from "@/components/Framework/Avatar/TpuAvatar.vue";
import { computed, ref, PropType } from "vue";
import { useUserStore } from "@/stores/user.store";
import functions from "@/plugins/functions";
import SetPictureDialog from "@/components/Core/Dialogs/SetPictureDialog.vue";
import TpuHover from "@/components/Framework/Hover/TpuHover.vue";
import RiUploadLine from "vue-remix-icons/icons/ri-upload-cloud-2-line.vue";
import TpuOverlay from "@/components/Framework/Overlay/TpuOverlay.vue";
import { Maybe, UserStatus, UserStoredStatus } from "@/gql/graphql";
import RiMoonFill from "vue-remix-icons/icons/ri-moon-fill.vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import { useAppStore } from "@/stores/app.store";
const props = defineProps({
  size: {
    default: 40,
    type: [Number, String]
  },
  src: {
    type: String
  },
  avatar: {
    type: String as PropType<Maybe<string> | string | undefined>
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
  },
  edit: {
    type: Boolean
  },
  fakeStatus: {
    type: String as () => UserStoredStatus | UserStatus
  },
  typing: {
    type: Boolean,
    default: false
  }
});
const userStore = useUserStore();
const appStore = useAppStore();

const user = computed(() => {
  return {
    ...(userStore.users[props.userId!] || {
      username: props.username,
      id: props.userId
    }),
    status: props.fakeStatus || userStore.users[props.userId!]?.status
  };
});
const editing = ref(false);

defineEmits(["setImage"]);
</script>

<style scoped>
.status {
  position: absolute;
  right: 0.1rem;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 1;
  transition:
    background-color 0.2s,
    color 0.2s,
    width 0.2s;
}

.typing-status {
  width: 24px;
  border-radius: 12px;
}

.badge {
  position: absolute;
  right: -0.3rem;
  top: 0;
  z-index: 100;
}

.dot {
  width: 0.2em;
  height: 0.2em;
  background: #101113;
  border-radius: 50%;
  animation: blink 1.5s infinite;
  opacity: 0;
}

.dot:nth-child(2) {
  animation-delay: 0.375s;
}

.dot:nth-child(3) {
  animation-delay: 0.75s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
}
</style>
