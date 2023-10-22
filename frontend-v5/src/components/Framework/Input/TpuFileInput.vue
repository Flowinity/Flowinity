<template>
  <div class="material-text-field relative mt-3 mb-1 w-100">
    <label
      :for="id"
      class="field-label cursor-text pointer-events-none"
      :class="{ active: focus }"
    >
      {{ props.label }}
    </label>
    <input
      type="file"
      class="file-input"
      v-on:change="$emit('update:modelValue', $event.target?.files)"
    />
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
  "shiftEnterNewLine",
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

defineExpose({
  input
});
</script>

<style scoped lang="scss">
.material-text-field {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: 1em;
  background-color: #0190ea; /* Material Design primary color */
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  user-select: none;
}

.file-input {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.field-label {
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.text-field:not(.placeholder-shown)::placeholder {
  color: transparent;
}

.text-field:focus + .form__label {
  color: #0190ea;
}
</style>
