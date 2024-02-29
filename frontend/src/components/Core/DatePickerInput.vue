<template>
  <v-menu
    offset-y
    v-model="open"
    min-width="auto"
    :close-on-content-click="false"
    :nudge-left="85"
    :scrim="false"
  >
    <template #activator="{ props }">
      <v-text-field
        dense
        outlined
        readonly
        hide-details
        v-bind="{ ...props, ...$attrs }"
        :model-value="transformDate"
        :label="label"
        :prepend-icon="calendarIcon"
        style="max-width: 360px"
      ></v-text-field>
    </template>
    <v-date-picker
      @change="handleChange"
      @input="open = false"
      v-model="date"
      hide-header
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import dayjs from "@/plugins/dayjs";

const props = defineProps({
  modelValue: {
    type: [String, Date, null]
  },
  label: {
    type: String
  }
});

const open = ref(false);
const date = ref<Date | null>(props.modelValue);
const calendarIcon = "mdi-calendar";

watch(
  () => props.modelValue,
  (newValue) => {
    date.value = newValue;
  }
);

watch(
  () => date.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

const handleChange = (value: string) => {
  date.value = value;
  emit("update:modelValue", value);
};

const emit = defineEmits(["update:modelValue"]);

const transformDate = computed(() => {
  if (!date.value) return null;
  return dayjs(date.value).format("YYYY-MM-DD");
});
</script>

<style scoped></style>
