<template>
  <div class="material-text-field relative mt-3 mb-1">
    <label
      :for="id"
      class="field-label cursor-text pointer-events-none"
      :class="{ active: focus || modelValue.length }"
    >
      {{ props.label }}
    </label>
    <textarea
      tabindex="0"
      :id="id"
      class="text-field resize-none"
      :placeholder="props.placeholder"
      :rows="computedRows.toString()"
      @input="$emit('update:modelValue', $event.target?.value)"
      :value="props.modelValue"
      ref="input"
      v-if="props.textarea"
      @focus="
        focus = true;
        interactedWith = true;
      "
      :maxlength="maxlength"
      @blur="
        focus = false;
        interactedWith = true;
      "
      v-bind="$attrs"
      :disabled="props.disabled"
      :class="{
        'placeholder-shown': !modelValue.length && focus,
        'text-medium-emphasis-dark': props.disabled
      }"
    ></textarea>
    <input
      tabindex="0"
      v-else
      :id="id"
      :placeholder="props.placeholder"
      @input="$emit('update:modelValue', $event.target?.value)"
      :value="props.modelValue"
      ref="input"
      class="text-field"
      @focus="
        focus = true;
        interactedWith = true;
      "
      @blur="
        focus = false;
        interactedWith = true;
      "
      :type="type"
      :maxlength="maxlength"
      v-bind="$attrs"
      :disabled="props.disabled"
      :class="{
        'placeholder-shown': !modelValue.length && focus,
        'text-medium-emphasis-dark': props.disabled
      }"
    />
    <div
      class="justify-end flex text-red text-xs mt-1"
      v-if="error || lengthError"
    >
      {{ error || lengthError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch, toRefs, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const input = ref<HTMLElement | null>(null);
const focus = ref(false);
const interactedWith = ref(false);

onMounted(() => {
  if (props.autofocus !== undefined) {
    input.value?.focus();
  }
  if (!props.ctrlEnterNewLine) {
    input.value?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.stopPropagation();
      }
    });
  } else {
    input.value?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.stopPropagation();
      } else if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  }
});
const props = defineProps([
  "readonly",
  "disabled",
  "textarea",
  "minLines",
  "maxLines",
  "label",
  "modelValue",
  "placeholder",
  "type",
  "maxlength",
  "minlength",
  "ctrlEnterNewLine",
  "error",
  "autofocus"
]);

const id = (Math.random() + 1).toString(36).substring(7);

defineEmits(["update:modelValue"]);

const lengthError = computed(() => {
  if (
    props.minlength &&
    interactedWith.value &&
    props.modelValue?.length < props.minlength
  ) {
    return t("generic.minLength", props.minlength);
  } else {
    return null;
  }
});

const computedRows = computed(() => {
  if (props.textarea) {
    let tmpRows = props.modelValue.split("\n").length;
    if (props.minLines) {
      tmpRows = Math.max(tmpRows, props.minLines);
    }
    if (props.maxLines) {
      tmpRows = Math.min(tmpRows, props.maxLines);
    }
    return tmpRows;
  }
  return 1;
});
</script>

<style scoped lang="scss">
.text-field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 1px solid #212224;
  outline: 0;
  font-size: 16px;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
  &:focus {
    padding-bottom: 6px;
    border-bottom: 2px solid #0190ea;
  }
}

.field-label {
  position: absolute;
  display: block;
  transition: 0.2s;
  font-size: 16px;
  color: #9b9b9b;
  top: 5px;
  &.active {
    top: -10px;
    font-size: 12px;
  }
}

.text-field:not(.placeholder-shown)::placeholder {
  display: none;
}

.text-field:focus + .form__label {
  color: #0190ea;
}
</style>
