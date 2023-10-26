<template>
  <text-field
    :label="t('generic.search')"
    class="flex-grow"
    :id="props.id"
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @keydown.enter="
      $emit('refresh');
      searchHistory.push({ value: $event });
    "
  >
    <template #append>
      <div class="flex items-center justify-center gap-1 mb-4">
        <tpu-button
          style="width: 45px; height: 45px"
          variant="passive"
          @click="
            $emit('update:modelValue', '');
            $emit('refresh');
          "
        >
          <RiCloseLine />
        </tpu-button>
        <tpu-button
          style="width: 45px; height: 45px"
          variant="passive"
          @click="$emit('refresh')"
        >
          <RiSearchLine />
        </tpu-button>
      </div>
    </template>
    <template v-slot="{ focus }">
      <card
        :outlined="true"
        v-if="focus"
        class="absolute bg-card-secondary-dark"
        :secondary="true"
        style="bottom: -69px; z-index: 2"
      ></card>
    </template>
  </text-field>
  <mentionable :keys="['@']" :id="`#${props.id}`" :items="results">
    <template #item="{ item }">
      {{ item }}
    </template>
  </mentionable>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import Mentionable from "@/components/Core/Mentionable.vue";
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: String,
  id: String
});

defineEmits(["update:modelValue", "refresh"]);

const { t } = useI18n();

const searchHistory = ref<{ value: strinfddffd }[]>([]);

const results = computed(() => {
  return searchHistory.value.filter((item) => {
    return item.toLowerCase().includes(props.modelValue?.toLowerCase());
  });
});

watch(
  () => searchHistory,
  () => {
    localStorage.setItem(
      "gallery-search-history",
      JSON.stringify(searchHistory.value.splice(0, 10))
    );
  }
);

onMounted(() => {
  const storage = localStorage.getItem(`${props.id}-search-history`);
  if (storage) {
    searchHistory.value = JSON.parse(storage);
  }
});
</script>

<style scoped></style>
