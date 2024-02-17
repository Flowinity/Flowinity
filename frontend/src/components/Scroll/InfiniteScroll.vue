<script lang="ts" setup>
import type { Params, Props, State, StateHandler } from "./types";
import { nextTick, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import { getParentEl, isVisible, startObserver } from "./utils";
import { useMessagesStore } from "@/store/message.store";

const emit = defineEmits<{ infinite: [$state: StateHandler] }>();
const props = withDefaults(defineProps<Props>(), {
  top: false,
  firstload: true,
  distance: 0,
  standalone: false
});
defineSlots<{
  spinner(props: {}): any;
  complete(props: {}): any;
  error(props: { retry(): void }): any;
}>();

let observer: IntersectionObserver | null = null;
let prevMessage = 0;
let prevHeight = 0;
const infiniteLoading = ref(null);
const state = ref<State>("");
const { top, firstload, distance } = props;
const { identifier, target } = toRefs(props);
const messages = useMessagesStore();
const params: Params = {
  infiniteLoading,
  top,
  firstload,
  distance,
  parentEl: null,
  emit() {
    if (props.standalone) {
      const parentEl = params.parentEl || document.documentElement;
      prevHeight = parentEl.scrollHeight;
      stateHandler.loading();
      emit("infinite", stateHandler);
      return;
    }
    if (!top) {
      prevMessage = messages.currentMessages?.[0]?.id;
    } else {
      prevMessage =
        messages.currentMessages?.[messages.currentMessages.length - 1]?.id;
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
    if (!props.standalone) {
      const message = document.getElementById(`message-id-${prevMessage}`);
      if (message) {
        message.scrollIntoView();
      }
    } else {
      const parentEl = params.parentEl || document.documentElement;
      if (top) parentEl.scrollTop = parentEl.scrollHeight - prevHeight;
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
