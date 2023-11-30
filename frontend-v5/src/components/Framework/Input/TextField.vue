<template>
  <div
    class="relative mt-3 mb-1 flex"
    :class="parentClasses"
    :style="parentStyle"
  >
    <slot name="prepend-outer" />
    <div class="absolute left-0">
      <slot name="prepend" />
    </div>
    <label
      :for="id"
      class="field-label cursor-text pointer-events-none"
      :class="{ active: focus || modelValue?.length }"
    >
      {{ props.label }}
    </label>
    <textarea
      v-if="props.textarea"
      :id="id"
      ref="input"
      tabindex="0"
      class="text-field resize-none"
      :placeholder="props.placeholder"
      :rows="computedRows.toString()"
      :value="props.modelValue"
      :maxlength="maxlength"
      v-bind="$attrs"
      :disabled="props.disabled"
      :class="{
        'placeholder-shown':
          !modelValue?.length && (focus || persistentPlaceholder),
        'text-medium-emphasis-dark': props.disabled,
        focused: focus
      }"
      :readonly="props.readonly"
      @input="$emit('update:modelValue', $event.target?.value)"
      @focus="
        focus = true;
        interactedWith = true;
      "
      @blur="
        focus = false;
        interactedWith = true;
      "
    ></textarea>
    <input
      v-else-if="!props.readonly"
      :id="id"
      ref="input"
      tabindex="0"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      class="text-field"
      :type="type"
      :maxlength="maxlength"
      v-bind="$attrs"
      :disabled="props.disabled"
      :class="{
        'placeholder-shown':
          !modelValue?.length && (focus || persistentPlaceholder),
        'text-medium-emphasis-dark': props.disabled,
        focused: focus,
        'hide-value': props.rawInject
      }"
      :readonly="props.readonly"
      @input="
        $emit('update:modelValue', $event.target?.value);
        props.dynamicWidth ? setWidth() : () => {};
      "
      @focus="
        focus = true;
        interactedWith = true;
      "
      @blur="
        focus = false;
        interactedWith = true;
      "
    />
    <div
      v-else
      class="text-field"
      role="button"
      tabindex="-1"
      :class="{
        'placeholder-shown':
          !modelValue?.length && (focus || persistentPlaceholder),
        'text-medium-emphasis-dark': props.disabled,
        focused: focus
      }"
      style="min-width: 200px"
      @click="
        focus = !focus;
        focus ? $emit('focus') : $emit('blur');
        interactedWith = !interactedWith;
      "
      @blur="
        $emit('blur');
        focus = false;
        interactedWith = false;
      "
    >
      <span v-if="props.modelValue.length">{{ props.modelValue }}</span>
      <span v-else-if="props.placeholder && focus">
        {{ props.placeholder }}
      </span>
      <span v-else class="text-medium-emphasis-dark">&nbsp;</span>
    </div>
    <div class="absolute right-0 -top-3">
      <slot name="append" />
    </div>
    <slot name="append-outer" />
    <div
      v-if="error || lengthError"
      class="justify-end flex text-red text-xs mt-1"
    >
      {{ error || lengthError }}
    </div>
    <slot :focus="focus" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const input = ref<HTMLElement | null>(null);
const focus = ref(false);
const interactedWith = ref(false);

onMounted(() => {
  if (props.autofocus !== undefined) {
    input.value?.focus();
  }
  if (!props.shiftEnterNewLine) {
    input.value?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.stopPropagation();
      }
    });
  } else {
    input.value?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.stopPropagation();
        e.preventDefault();
      }
    });
  }

  if (props.dynamicWidth) setWidth();
});

const setWidth = () => {
  if (!props.dynamicWidth) return undefined;
  if (!props.modelValue.length) return;
  input.value!!.style.width = "60px";
  input.value!!.style.width = `${input.value!!.scrollWidth}px`;
};

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
  "shiftEnterNewLine",
  "error",
  "autofocus",
  "parentClasses",
  "parentStyle",
  "htmlId",
  "dynamicWidth",
  "persistentPlaceholder",
  "rawInject"
]);

const id = computed(() => {
  return props.htmlId || (Math.random() + 1).toString(36).substring(7);
});

defineEmits(["update:modelValue", "focus", "blur"]);

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
    let tmpRows = props.modelValue?.split("\n").length;
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

defineExpose({
  input
});
</script>

<style scoped lang="scss">
.text-field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #212224;
  outline: 0;
  font-size: 16px;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
}

.focused {
  border-bottom: 2px solid #0190ea;
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
  color: transparent;
}

.text-field:focus + .form__label {
  color: #0190ea;
}

.hide-value {
  color: transparent;
}
</style>
