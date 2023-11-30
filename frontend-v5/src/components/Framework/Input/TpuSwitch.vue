<template>
  <div
    class="flex items-center min-w"
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
      class="flex rounded-full items-center transition duration-200 ease-in-out border-2"
      :class="{
        'transition-background-color duration-300 ease-in-out bg-blue dark:border-blue':
          value,
        'transition-background-color duration-300 ease-in-out bg-gray dark:bg-transparent dark:border-gray':
          !value,
        'bg-opacity-10 border-opacity-10': variant === 'tonal'
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
        class="w-6 h-6 flex justify-center rounded-full shadow-md transform transition duration-200 ease-in-out text-card-dark fill-card-dark"
        :class="{
          'translate-x-6': value,
          'translate-x-1': !value,
          'bg-white': variant === 'filled' || !value,
          'bg-blue fill-[#0e1e29]': variant === 'tonal' && value
        }"
        style="margin-left: 0.5px"
      >
        <RiCheckLine v-if="value" style="width: 15px" />
        <RiCloseLine v-else style="width: 15px" />
      </div>
    </div>
    <div
      class="block select-none ml-3 text-sm font-medium dark:text-medium-emphasis-dark"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";

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
