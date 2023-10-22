<template>
  <div class="gap-4 p-4 flex w-full">
    <text-field
      :label="t('generic.search')"
      class="flex-grow"
      :model-value="props.search"
      @update:model-value="$emit('update:search', $event)"
      @keydown.enter="$emit('refresh')"
    ></text-field>
    <tpu-select
      style="min-width: 200px"
      :label="t('gallery.options.filter')"
      class="cursor-default"
      :custom-text="filterText"
    >
      <div class="flex-col flex-grow w-full">
        <div class="w-full">
          <tpu-overline position="start">Filter</tpu-overline>
          <ul>
            <li
              v-wave
              tabindex="0"
              :key="item.internalName"
              v-for="item in props.types"
              @click="
                filter.find((f) => f === item.internalName)
                  ? removeFilter(item.internalName)
                  : $emit('update:filter', [...filter, item.internalName]);
                $emit('refresh');
              "
              :class="{
                'bg-card-secondary-dark': filter.includes(item.internalName)
              }"
              class="text-ellipsis overflow-hidden pl-2 cursor-pointer"
            >
              <div class="my-2 mx-2">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </tpu-select>
    <tpu-select
      style="min-width: 200px"
      :label="t('gallery.options.sort')"
      :custom-text="sortText"
    >
      <div class="flex-col flex-grow w-full">
        <div class="w-full">
          <tpu-overline position="start">Sort</tpu-overline>
          <ul>
            <li
              v-wave
              tabindex="0"
              :key="item.internalName"
              v-for="item in props.sortTypes"
              class="text-ellipsis overflow-hidden pl-2 cursor-pointer"
              @click="
                $emit('update:sort', item.internalName);
                $emit('refresh');
              "
              :class="{
                'bg-card-secondary-dark': sort === item.internalName
              }"
            >
              <div class="my-2 mx-2">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
        <div class="w-full">
          <tpu-overline position="start">Direction</tpu-overline>
          <ul>
            <li
              v-wave
              tabindex="0"
              :key="item.internalName"
              v-for="item in props.orderTypes"
              class="text-ellipsis overflow-hidden pl-2 cursor-pointer"
              @click="
                $emit('update:order', item.internalName);
                $emit('refresh');
              "
              :class="{
                'bg-card-secondary-dark': order === item.internalName
              }"
            >
              <div class="my-2 mx-2">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </tpu-select>
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import { GalleryFilter, GalleryOrder, GallerySort } from "@/gql/graphql";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  search: {
    type: String
  },
  orderTypes: {
    type: Array as () => {
      name: string;
      internalName: GalleryOrder;
    }[],
    required: false,
    default: [
      {
        name: "Ascending",
        internalName: GalleryOrder.Asc
      },
      {
        name: "Descending",
        internalName: GalleryOrder.Desc
      },
      {
        name: "Random",
        internalName: GalleryOrder.Random
      }
    ]
  },
  sortTypes: {
    type: Array as () => {
      name: string;
      internalName: GallerySort;
    }[],
    required: false,
    default: [
      {
        name: "Created at",
        internalName: GallerySort.CreatedAt
      },
      {
        name: "Name",
        internalName: GallerySort.Name
      },
      {
        name: "Size",
        internalName: GallerySort.Size
      }
    ]
  },
  types: {
    type: Array as () => {
      name: string;
      internalName: GalleryFilter;
    }[],
    required: false,
    default: [
      {
        name: "Search in screenshots",
        internalName: GalleryFilter.IncludeMetadata
      },
      {
        name: "Not collectivized",
        internalName: GalleryFilter.NoCollection
      },
      {
        name: "Images",
        internalName: GalleryFilter.Images
      },
      {
        name: "Videos",
        internalName: GalleryFilter.Videos
      },
      {
        name: "Audio",
        internalName: GalleryFilter.Audio
      },
      {
        name: "Text",
        internalName: GalleryFilter.Text
      },
      {
        name: "Other",
        internalName: GalleryFilter.Other
      },
      {
        name: "Include Deletable",
        internalName: GalleryFilter.IncludeDeletable
      },
      {
        name: "Owned items",
        internalName: GalleryFilter.Owned
      },
      {
        name: "Not owned items",
        internalName: GalleryFilter.Shared
      }
    ]
  },
  filter: {
    default: () => {
      return [GalleryFilter.IncludeMetadata];
    },
    type: Object as () => GalleryFilter[]
  },
  sort: {
    default: GallerySort.CreatedAt,
    type: Object as () => GallerySort
  },
  order: {
    default: GalleryOrder.Desc,
    type: Object as () => GalleryOrder
  }
});
const emit = defineEmits([
  "update:filter",
  "update:search",
  "update:metadata",
  "refresh",
  "update:sort",
  "update:order"
]);

function removeFilter(filter: GalleryFilter) {
  const indexToRemove = props.filter.indexOf(filter);

  if (indexToRemove !== -1) {
    const updatedFilter = props.filter.slice();

    updatedFilter.splice(indexToRemove, 1);

    // Emit the updated filter array
    emit("update:filter", updatedFilter);
  }
}

const filterText = computed(() => {
  const filterNames = props.filter.map((filterValue) => {
    const matchingFilterType = props.types.find(
      (item) => item.internalName === filterValue
    );
    return matchingFilterType ? matchingFilterType.name : "";
  });

  return filterNames.filter((name) => name !== "").join(", ");
});

const sortText = computed(() => {
  return props.sortTypes.find((type) => type.internalName === props.sort)?.name;
});
</script>

<style scoped></style>
