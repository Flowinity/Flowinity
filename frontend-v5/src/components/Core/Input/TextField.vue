<template>
  <div class="material-text-field">
    <textarea
      id="message"
      class="form__field"
      :placeholder="props.placeholder"
      :rows="computedRows.toString()"
      @input="$emit('update:modelValue', $event.target?.value)"
      :value="props.modelValue"
      ref="input"
      v-if="props.textarea"
    ></textarea>
    <input
      v-else
      :placeholder="props.placeholder"
      @input="$emit('update:modelValue', $event.target?.value)"
      :value="props.modelValue"
      ref="input"
      class="form__field"
    />
    <label for="message" class="form__label">{{ props.label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch, toRefs, onMounted } from "vue";

const input = ref<HTMLElement | null>(null);

onMounted(() => {
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
  "ctrlEnterNewLine"
]);

defineEmits(["update:modelValue"]);

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
.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 1px solid #212224;
  outline: 0;
  font-size: 16px;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
}

.form__field::placeholder {
  color: transparent;
}

.form__field:placeholder-shown ~ .form__label {
  font-size: 16px;
  cursor: text;
  top: 20px;
}

label,
.form__field:focus ~ .form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 12px;
  color: #9b9b9b;
}

.form__field:focus ~ .form__label {
  color: #0190ea;
}

.form__field:focus {
  padding-bottom: 6px;
  border-bottom: 2px solid #0190ea;
}
</style>
