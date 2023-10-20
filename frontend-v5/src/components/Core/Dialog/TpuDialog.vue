<template>
  <div class="dialog-scrim" v-if="props.modelValue" />
  <transition name="dialog-transition" appear>
    <div
      v-if="props.modelValue"
      @click="$emit('update:modelValue', false)"
      class="dialog-outer"
      @keydown.esc="$emit('update:modelValue', false)"
    >
      <slot name="dialog-outer">
        <div
          class="dialog-content"
          @click.stop
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
                <tpu-toolbar class="flex justify-between items-center">
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
import TpuToolbar from "@/components/Core/Toolbar/TpuToolbar.vue";
import Card from "@/components/Core/Card/Card.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";

const props = defineProps({
  modelValue: Boolean,
  width: [Number, String],
  height: [Number, String]
});
defineEmits(["update:modelValue"]);
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
