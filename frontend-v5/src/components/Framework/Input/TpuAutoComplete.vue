<template>
  <div class="relative">
    <div class="overlay"></div>
    <text-field
      @focus="focused = true"
      @blur="focused = false"
      v-model="text"
      v-bind="$attrs"
      @keydown.down.stop.prevent="
        focused = true;
        selected >= items.length - 1 ? (selected = 0) : selected++;
      "
      @keydown.up.stop.prevent="
        focused = true;
        selected <= 0 ? (selected = items.length - 1) : selected--;
      "
      @keydown.enter.prevent.stop="
        $emit('update:modelValue', items[selected].id);
        hovering = false;
        focused = false;
      "
      @click="focused = true"
      :disabled="props.disabled"
      @update:model-value="
        focused = true;
        remove($event);
      "
      ref="input"
    />

    <transition name="dialog-transition" appear>
      <div
        class="dropdown-options rounded-l bg-card-dark"
        :key="show"
        v-if="show"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
        @click="focus()"
      >
        <slot>
          <ul>
            <li
              v-wave
              tabindex="0"
              :key="item.id"
              :class="{ 'bg-card-secondary-dark': selected === index }"
              v-for="(item, index) in items"
              @click.stop.prevent="
                $emit('update:modelValue', item.id);
                hovering = false;
                focus();
                focused = false;
              "
              @mouseover="selected = index"
              class="text-ellipsis overflow-hidden"
            >
              <div class="my-2 mx-2">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { computed, ref, watch } from "vue";
const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Object as () => {
      id: string | boolean | number;
      name: string;
      [key: string]: any;
    }[]
  },
  disabled: Boolean,
  customText: String
});
const emit = defineEmits(["update:modelValue"]);
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
    if (props.customText) return props.customText;
    const find = props.items?.find((item) => item.id === props.modelValue);
    if (find) return find.name;
    return "";
  },
  set(newValue) {
    filter.value = newValue;
  }
});
const input = ref<InstanceType<typeof TextField> | null>(null);
function focus() {
  input.value?.input?.focus();
}
function remove(val) {
  if (!val) {
    selected.value = 0;
    emit("update:modelValue", 0);
    text.value = "";
    filter.value = "";
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  user-select: none;
  width: 100%;
  height: 100%;
}
.overlay::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dropdown-options {
  position: absolute;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  width: 100%;
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
