<template>
  <div v-if="props.modelValue" class="dialog-scrim" />
  <transition name="dialog-transition" appear>
    <div
      v-if="props.modelValue"
      class="dialog-outer"
      @mousedown="scrimDetect"
      @mouseup="
        scrim && !props.persistent
          ? $emit('update:modelValue', false)
          : () => {}
      "
    >
      <slot name="dialog-outer">
        <div
          class="dialog-content break-all"
          :style="{
            height: height + 'px',
            maxHeight: height + 'px',
            width: props.width + 'px',
            maxWidth: props.width + 'px'
          }"
        >
          <slot name="content">
            <card :padding="false" v-bind="$attrs">
              <div>
                <tpu-toolbar class="flex justify-between items-center px-4">
                  <div>
                    <slot name="toolbar"></slot>
                  </div>
                  <div>
                    <tpu-button
                      variant="passive"
                      icon
                      @click="$emit('update:modelValue', false)"
                    >
                      <RiCloseLine style="height: 20px" />
                    </tpu-button>
                  </div>
                </tpu-toolbar>
                <div>
                  <slot></slot>
                </div>
              </div>
            </card>
          </slot>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import TpuToolbar from "@/components/Framework/Toolbar/TpuToolbar.vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useFrameworkStore } from "@/stores/framework.store";

const props = defineProps({
  modelValue: Boolean,
  width: [Number, String],
  height: [Number, String],
  persistent: Boolean
});
const emit = defineEmits(["update:modelValue"]);
const scrim = ref(false);

function scrimDetect(event) {
  scrim.value = event?.target?.classList.contains("dialog-outer");
}

function handleClose(event: KeyboardEvent) {
  if (props.persistent) return;
  if (event.key === "Escape") {
    emit("update:modelValue", false);
  }
}

const framework = useFrameworkStore();

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      framework.dialogsOpened = framework.dialogsOpened - 1;
      if (!framework.dialogsOpened) {
        document.body.classList.remove(
          "blocked-scroll",
          "scrollbar-fake-padding"
        );
      }
      document.removeEventListener("keydown", handleClose);
      return;
    }
    framework.dialogsOpened++;
    document.addEventListener("keydown", handleClose);
    document.body.classList.add("blocked-scroll");
    if (
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight
    ) {
      document.body.classList.add("scrollbar-fake-padding");
    }
  }
);
</script>

<style scoped>
.dialog-scrim {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3001;
}

.dialog-outer {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3002;
}
</style>
