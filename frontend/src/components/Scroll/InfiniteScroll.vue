<script lang="ts" setup>
import type { Props, Params, State, StateHandler } from "./types";
import { onMounted, ref, toRefs, onUnmounted, watch, nextTick } from "vue";
import { startObserver, getParentEl, isVisible } from "./utils";
import { useChatStore } from "@/store/chat.store";

const emit = defineEmits<{ infinite: [$state: StateHandler] }>();
const props = withDefaults(defineProps<Props>(), {
  top: false,
  firstload: true,
  distance: 0
});
defineSlots<{
  spinner(props: {}): any;
  complete(props: {}): any;
  error(props: { retry(): void }): any;
}>();

let observer: IntersectionObserver | null = null;
let prevMessage = 0;
const infiniteLoading = ref(null);
const state = ref<State>("");
const { top, firstload, distance } = props;
const { identifier, target } = toRefs(props);
const chat = useChatStore();
const params: Params = {
  infiniteLoading,
  top,
  firstload,
  distance,
  parentEl: null,
  emit() {
    if (!top) {
      prevMessage = chat.selectedChat?.messages[0]?.id;
    } else {
      prevMessage =
        chat.selectedChat?.messages[chat.selectedChat?.messages.length - 1]?.id;
    }
    stateHandler.loading();
    emit("infinite", stateHandler);
  }
};

const stateHandler: StateHandler = {
  loading() {
    state.value = "loading";
  },
  async loaded() {
    state.value = "loaded";
    await nextTick();
    const message = document.getElementById(`message-id-${prevMessage}`);
    if (message) {
      message.scrollIntoView();
    }
    if (isVisible(infiniteLoading.value!, params.parentEl)) params.emit();
  },
  complete() {
    state.value = "complete";
    observer?.disconnect();
  },
  error() {
    state.value = "error";
  }
};

watch(identifier, () => {
  observer?.disconnect();
  observer = startObserver(params);
});

onMounted(async () => {
  params.parentEl = await getParentEl(target!);
  observer = startObserver(params);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="infiniteLoading"
    :style="{ 'min-height': state !== 'complete' ? '1px' : undefined }"
  >
    <div v-show="state == 'loading'">
      <slot name="spinner"></slot>
    </div>
    <slot v-if="state == 'complete'" name="complete"></slot>
    <slot v-if="state == 'error'" name="error" :retry="params.emit">
      <span class="state-error">
        <button class="retry" @click="params.emit">retry</button>
      </span>
    </slot>
  </div>
</template>

<style scoped>
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.retry {
  margin-top: 8px;
  padding: 2px 6px 4px 6px;
  width: 60px;
  color: inherit;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  border: 2px solid currentColor;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}
.retry:hover {
  opacity: 0.8;
}
</style>
