<template>
  <v-row>
    <v-col v-if="supports.search">
      <GalleryTextField
        v-model="search"
        @update:modelValue="$emit('update:search', search)"
        @submit="$emit('refreshGallery')"
      />
    </v-col>
    <v-col v-if="supports.sort" cols="12" md="4">
      <v-select
        v-model="sort"
        :items="[]"
        :label="$t('generic.options')"
        item-title="name"
        item-value="internalName"
      >
        <template v-slot:no-data>
          <template v-if="supports.metadata">
            <overline position="start">
              {{ $t("generic.options") }}
            </overline>
            <v-list-item
              @click="
                metadata = !metadata;
                $emit('update:metadata', metadata);
                $emit('refreshGallery');
              "
              :active="metadata"
            >
              {{ $t("generic.metadata") }}
            </v-list-item>
          </template>
          <overline position="start">
            {{ $t("generic.sortDirection") }}
          </overline>
          <v-list-item
            v-for="item in orderTypes"
            @click="
              order = item.internalName;
              $emit('update:order', order);
              $emit('refreshGallery');
            "
            :active="order === item.internalName"
          >
            {{ item.name }}
          </v-list-item>
          <template v-if="supports.sort">
            <overline position="start">
              {{ $t("generic.sort") }}
            </overline>
            <v-list-item
              v-for="item in sortTypes"
              @click="
                sort = item.internalName;
                $emit('update:sort', sort);
                $emit('refreshGallery');
              "
              :active="sort === item.internalName"
            >
              {{ item.name }}
            </v-list-item>
          </template>
          <template v-if="supports.filter">
            <overline position="start">{{ $t("generic.filter") }}</overline>
            <v-list-item
              v-for="item in types"
              @click="
                filter.find((f) => f === item.internalName)
                  ? filter.splice(filter.indexOf(item.internalName), 1)
                  : filter.push(item.internalName);
                $emit('update:filter', filter);
                $emit('refreshGallery');
              "
              :active="filter.includes(item.internalName)"
            >
              {{ item.name }}
            </v-list-item>
          </template>
        </template>
        <template v-slot:selection>
          {{
            $t("generic.option", {
              count: filter.length
            })
          }}
        </template>
      </v-select>
    </v-col>
    <v-col v-if="supports.upload" sm="auto" align-self="center">
      <v-btn block @click="$app.dialogs.upload.value = true">
        <v-icon class="mr-1">mdi-upload</v-icon>
        {{ $t("generic.upload") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GalleryFilter, GalleryOrder, GallerySort } from "@/gql/graphql";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  name: "GalleryNavigation",
  computed: {
    GalleryFilter() {
      return GalleryFilter;
    }
  },
  components: { Overline, GalleryTextField },
  emits: [
    "update:filter",
    "update:search",
    "update:metadata",
    "refreshGallery",
    "update:sort",
    "update:order"
  ],
  props: {
    supports: {
      type: Object,
      required: false,
      default: {
        filter: true,
        metadata: true,
        search: true,
        upload: false,
        sort: true
      }
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
          name: "All of them",
          internalName: GalleryFilter.All
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
    }
  },
  data() {
    return {
      metadata: true,
      filter: [GalleryFilter.All],
      sort: GallerySort.CreatedAt,
      order: GalleryOrder.Desc,
      search: ""
    };
  }
});
</script>

<style scoped></style>
