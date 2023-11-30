<template>
  <text-field
    ref="input"
    :label="t('generic.search')"
    :assist="true"
    class="flex-grow"
    autocomplete="off"
    :html-id="props.inputId"
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @keydown.enter="
      $emit('refresh');
      addItem({
        value: props.modelValue || '',
        date: new Date().toISOString()
      });
    "
  >
    <template #append>
      <div class="flex items-center justify-center gap-1 mb-4">
        <tpu-button
          variant="passive"
          style="width: 45px; height: 45px"
          @click="
            $emit('update:modelValue', '');
            $emit('refresh');
          "
        >
          <RiCloseLine />
        </tpu-button>
      </div>
    </template>
  </text-field>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  modelValue: String,
  inputId: String
});
const input = ref<InstanceType<typeof TextField> | null>(null);
defineExpose({
  input
});
defineEmits(["update:modelValue", "refresh"]);

const { t } = useI18n();
const selectedIndex = ref(0);

const searchHistory = ref<{ value: string; date: string }[]>([]);
const hover = ref(false);
watch(
  () => searchHistory.value,
  () => {
    localStorage.setItem(
      `${props.inputId}-search-history`,
      JSON.stringify(searchHistory.value)
    );
  },
  {
    deep: true
  }
);

function addItem(item: { value: string; date: string }) {
  if (item.value === "") return;
  const find = searchHistory.value.findIndex(
    (entry) => entry.value === item.value
  );
  if (find !== -1) {
    searchHistory.value.splice(find, 1);
  }
  searchHistory.value.unshift(item);
  searchHistory.value = searchHistory.value.slice(0, 20);
}

onMounted(() => {
  const storage = localStorage.getItem(`${props.inputId}-search-history`);
  if (storage) {
    searchHistory.value = JSON.parse(storage);
  }
});
</script>

<style scoped></style>
