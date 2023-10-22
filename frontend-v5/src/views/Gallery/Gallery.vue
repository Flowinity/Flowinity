<template>
  <upload-editor v-model="$app.dialogs.gallery.edit.value" />
  <OCRScanned v-model="$app.dialogs.gallery.ocr.value" />
  <upload-file v-model="appStore.dialogs.gallery.upload.value" />
  <add-to-collection v-model="appStore.dialogs.gallery.collect.value" />
  <delete-upload v-model="appStore.dialogs.gallery.delete.value" />
  <gallery-navigation
    v-model:search="search"
    @refresh="getGallery()"
    v-model:filter="filter"
    v-model:metadata="metadata"
    v-model:sort="sort"
    v-model:order="order"
    :types="types"
  />
  <gallery-core
    :id="id"
    :type="type"
    :selected="selected"
    :items="items"
    @select="select($event)"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
    <template
      #extra-item-attributes="{ item }: { item: Upload }"
      v-if="type === GalleryType.Starred"
    >
      <p>
        {{
          t("gallery.attributes.createdBy", {
            name: item.user?.username
          })
        }}
      </p>
    </template>
  </gallery-core>
  <tpu-pager
    class="mb-2"
    v-model="page"
    :total-pages="pager?.totalPages || 1"
  />
  <div class="mb-2 text-center text-medium-emphasis-dark">
    <p>
      Total items: {{ pager?.totalItems.toLocaleString() }} &bullet; Total
      pages:
      {{ pager?.totalPages.toLocaleString() }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AddToCollectionInput, Pager, Upload } from "@/gql/graphql";
import {
  GalleryFilter,
  GalleryOrder,
  GallerySort,
  GalleryType
} from "@/gql/graphql";
import { computed, onMounted, type Ref, ref, watch } from "vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { useApolloClient } from "@vue/apollo-composable";
import TpuPager from "@/components/Framework/Pager/TpuPager.vue";
import DeleteUpload from "@/components/Gallery/Dialogs/DeleteUpload.vue";
import { useAppStore } from "@/stores/app.store";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { useSocket } from "@/boot/socket.service";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import UploadFile from "@/components/Gallery/Dialogs/UploadFile.vue";
import OCRScanned from "@/components/Gallery/Dialogs/OCRScanned.vue";
import UploadEditor from "@/components/Gallery/Dialogs/UploadEditor.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const page = ref(1);
const loading = ref(false);
const items = ref<Upload[]>([]);
const pager = ref<Pager | null>(null);
const appStore = useAppStore();
const selected: Ref<number[]> = ref([]);
const collectionsStore = useCollectionsStore();
const search = ref("");
const filter = ref([GalleryFilter.IncludeMetadata]);
const sort = ref(GallerySort.CreatedAt);
const order = ref(GalleryOrder.Desc);
const metadata = ref(false);

function select(id: number | number[]) {
  if (Array.isArray(id)) {
    if (!id.length) return (selected.value = []);
    for (const numberToAdd of id) {
      if (selected.value.indexOf(numberToAdd) === -1) {
        selected.value.push(numberToAdd);
      }
    }
  } else {
    const index = selected.value.indexOf(id);
    if (index === -1) {
      selected.value.push(id);
    } else {
      selected.value.splice(index, 1);
    }
  }
}

function pushCollection(data: AddToCollectionInput) {
  const collection = collectionsStore.items.find(
    (collection) => collection.id === data.collectionId
  );
  if (!collection) return;
  for (const item of data.items) {
    const find = items.value.find((upload) => upload.id === item);
    if (find) find.collections.push(collection);
  }
}

async function getGallery() {
  loading.value = true;
  const {
    data: { gallery }
  } = await useApolloClient().client.query({
    query: GalleryQuery,
    variables: {
      input: {
        search: search.value,
        page: page.value,
        type: props.type,
        filters: filter.value,
        sort: sort.value,
        order: order.value,
        collectionId: typeof props.id === "number" ? props.id : undefined,
        shareLink: typeof props.id === "string" ? props.id : undefined
      }
    },
    fetchPolicy: "network-only"
  });
  items.value = gallery.items;
  pager.value = gallery.pager;
  loading.value = false;
  resetScroll();
  return gallery;
}

const props = defineProps({
  path: {
    type: String,
    default: "/gallery"
  },
  type: {
    type: String as () => GalleryType,
    default: GalleryType.Personal
  },
  name: {
    type: String,
    default: "Gallery"
  },
  id: {
    type: [String, Number]
  }
});

onMounted(() => {
  getGallery();
});

function resetScroll() {
  document.getElementById("app-area")!.scrollTop = 0;
}

watch(
  () => [props.type, props.id],
  () => {
    page.value = 1;
    search.value = "";
    getGallery();
  }
);

watch(
  () => [page.value],
  () => {
    getGallery();
  }
);

// Socket handlers
useSocket.gallery.on("update", (data: Upload[]) => {
  data.forEach((upload) => {
    const isNewItem = !items.value.some((item) => item.id === upload.id);
    if (
      isNewItem &&
      props.type === GalleryType.Collection &&
      upload.collections?.some((collection) => collection.id === props.id)
    ) {
      items.value = [upload, ...items.value];
    } else {
      items.value = items.value.map((item) => {
        if (item.id === upload.id) {
          return {
            ...item,
            name: upload.name !== undefined ? upload.name : item.name,
            textMetadata:
              upload.textMetadata !== undefined
                ? upload.textMetadata
                : item.textMetadata,
            collections:
              upload.collections !== undefined
                ? upload.collections
                : item.collections,
            starred:
              upload.starred !== undefined ? upload.starred : item.starred
          };
        }
        return item;
      });
    }
  });
  console.log("update");
});
useSocket.gallery.on("delete", (data: number) => {
  items.value = items.value.filter((upload) => upload.id !== data);
});

useSocket.gallery.on("create", (data: { upload: Upload; url: String }[]) => {
  if (page.value !== 1 || props.type !== GalleryType.Personal) return;
  items.value = [...data.map((d) => d.upload), ...items.value];
  console.log("update");
});

defineExpose({
  getGallery
});

const types = computed(() => {
  const types = [
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
      name: "Include Undeletable",
      internalName: GalleryFilter.IncludeDeletable
    }
  ];
  if (props.type !== GalleryType.Personal) {
    types.push(
      {
        name: "Owned items",
        internalName: GalleryFilter.Owned
      },
      {
        name: "Not owned items",
        internalName: GalleryFilter.Shared
      }
    );
  }
  return types;
});
</script>

<style scoped></style>
