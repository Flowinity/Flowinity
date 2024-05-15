<template>
  <div
    class="flex items-center my-2"
    :class="{
      'opacity-60': disabled,
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled
    }"
    :aria-disabled="disabled"
    @click="value = !value"
  >
    <div
      tabindex="0"
      class="flex rounded-full items-center duration-200 ease-in-out border-2"
      :class="{
        'border-blue': value,
        'bg-gray bg-transparent border-gray': !value,
        'bg-blue/10': variant === 'tonal',
        'transition-background-color transition duration-300 ease-in-out':
          !$experiments.experiments.DISABLE_ANIMATIONS
      }"
      style="
        min-width: 56px;
        min-height: 36px;
        max-height: 36px;
        max-width: 56px;
      "
      @keydown.space.prevent="value = !value"
      @keydown.enter.prevent="value = !value"
    >
      <input
        v-model="value"
        type="checkbox"
        class="hidden"
        :disabled="disabled"
        :aria-disabled="disabled"
      />
      <div
        class="w-6 h-6 flex justify-center rounded-full shadow-md dark:text-black fill-card-dark bg-black"
        :class="{
          'translate-x-6': value,
          'translate-x-1': !value,
          'bg-white':
            (variant === 'filled' || !value) && $vuetify.theme.current.dark,
          'bg-blue text-black fill-[#0e1e29]': variant === 'tonal' && value,
          'transition transform ease-in-out duration-200':
            !$experiments.experiments.DISABLE_ANIMATIONS
        }"
        style="margin-left: 0.5px"
      >
        <RiCheckLine v-if="value" style="width: 15px" />
        <RiCloseLine v-else style="width: 15px" />
      </div>
    </div>
    <div
      class="select-none ml-3 text-sm font-medium text-medium-emphasis-dark whitespace-pre-wrap"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RiCloseLine } from "@remixicon/vue";
import RiCheckLine from "@/components/Icons/v5/ri-check-line.vue";

const props = defineProps({
  modelValue: Boolean,
  label: String,
  variant: {
    type: String as () => "tonal" | "filled",
    default: "tonal"
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    if (props.disabled) return;
    emit("update:modelValue", newValue);
  }
});
</script>
