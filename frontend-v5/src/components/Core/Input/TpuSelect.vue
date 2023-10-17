<template>
  <div class="relative">
    <text-field
      @focus="focused = true"
      @blur="focused = false"
      v-model="text"
      v-bind="$attrs"
      @keydown.down.stop="
        focused = true;
        selected >= items.length ? (selected = 0) : selected++;
      "
      @keydown.up.stop="
        focused = true;
        selected <= 0 ? (selected = items.length) : selected--;
      "
      @keydown.enter="
        $emit('update:modelValue', items[selected].id);
        hovering = false;
        focused = false;
      "
      @click="focused = true"
      disabled
      @update:model-value="focused = true"
    />
    <transition name="dialog-transition" appear>
      <div
        class="dropdown-options rounded-l bg-card-dark"
        :key="show"
        v-if="show"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
      >
        <ul>
          <li
            tabindex="0"
            :key="item.id"
            :class="{ 'bg-card-secondary-dark': selected === index }"
            v-for="(item, index) in items"
            @click.stop.prevent="
              $emit('update:modelValue', item.id);
              hovering = false;
            "
            @mouseover="selected = index"
          >
            <div class="my-2 mx-2">
              {{ item.name }}
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/Core/Input/TextField.vue";
import { computed, ref } from "vue";
const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Object as () => {
      id: string;
      name: string;
      [key: string]: any;
    }[]
  }
});
defineEmits(["update:modelValue"]);
const show = computed(() => {
  return hovering.value || focused.value;
});
const hovering = ref(false);
const focused = ref(false);
const filter = ref("");
const selected = ref(0);
const items = computed(() => {
  if (!props.items) return [];
  return props.items?.filter((item) => {
    return item.name.toLowerCase().includes(filter.value.toLowerCase());
  });
});
const text = computed({
  get() {
    const find = props.items?.find((item) => item.id === props.modelValue);
    if (find) return find.name;
    return "";
  },
  set(newValue) {
    filter.value = newValue;
  }
});
function scrollTo(index: number) {}
</script>

<style scoped>
.dropdown-options {
  position: absolute;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10001;
}

.dropdown-options ul {
  list-style: none;
  padding: 0;
}

.dropdown-options ul li {
  padding: 8px;
  cursor: pointer;
}
</style>
