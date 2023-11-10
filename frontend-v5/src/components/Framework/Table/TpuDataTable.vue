<template>
  <div class="overflow-x-auto">
    <table
      class="w-full border-collapse text-left text-gray-500 dark:text-gray-400"
    >
      <thead class="dark:bg-card-dark">
        <tr
          class="border-t-2 border-b-2 border-gray-300 dark:border-outline-dark"
        >
          <th
            v-for="(header, index) in headers"
            :key="header.id"
            scope="col"
            class="py-2 px-4 font-semibold text-sm text-gray-600 dark:text-gray-300"
            :class="{
              'cursor-pointer': header.sortable
            }"
            @click="sort(header.id)"
          >
            {{ header.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in sortedItems"
          :key="item.id"
          class="border-b dark:border-outline-dark hover:bg-outline-dark"
        >
          <td
            v-for="(header, index) in headers"
            :key="header.id"
            class="px-4 text-sm flex-col"
            :class="{ 'text-center items-center': index !== 0 }"
          >
            <div class="text-left items-start flex" style="width: fit-content">
              <slot :name="'item.' + header.id" :item="item">
                {{ accessNestedProperty(item, header.id) }}
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="px-4 py-2 justify-center flex w-full"
      v-if="!sortedItems.length"
    >
      No items
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps({
  items: Array,
  headers: Array
});

const sortBy = ref("");
const sortOrder = ref("asc");

const sortedItems = computed(() => {
  if (!sortBy.value) return props.items;

  return [...props.items].sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];
    if (sortOrder.value === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return bValue < aValue ? -1 : 1;
    }
  });
});

function accessNestedProperty(obj, propertyString) {
  const properties = propertyString.split(".");
  let result = obj;

  for (const property of properties) {
    if (result.hasOwnProperty(property)) {
      result = result[property];
    } else {
      // Property doesn't exist
      result = undefined;
      break;
    }
  }

  return result;
}

const sort = (headerId) => {
  if (!props.headers.find((header) => header.id === headerId)?.sortable) return;

  if (headerId === sortBy.value) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = headerId;
    sortOrder.value = "asc";
  }
};

watch(
  () => props.headers,
  () => {
    if (!props.headers.find((header) => header.id === sortBy.value)?.sortable) {
      sortBy.value = "";
    }
  }
);
</script>
