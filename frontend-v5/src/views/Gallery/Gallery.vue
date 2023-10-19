<template>
  <upload-editor v-model="$app.dialogs.gallery.edit.value" />
  <OCRScanned v-model="$app.dialogs.gallery.ocr.value" />
  <upload-file v-model="appStore.dialogs.gallery.upload.value" />
  <add-to-collection v-model="appStore.dialogs.gallery.collect.value" />
  <delete-upload v-model="appStore.dialogs.gallery.delete.value" />
  <gallery-navigation v-model:search="search" @refresh="getGallery()" />
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
import { GalleryInput, GalleryType } from "@/gql/graphql";
import { onMounted, type Ref, ref, watch } from "vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { useApolloClient } from "@vue/apollo-composable";
import TpuPager from "@/components/Core/Pager/TpuPager.vue";
import DeleteUpload from "@/components/Gallery/Dialogs/DeleteUpload.vue";
import { useAppStore } from "@/stores/app.store";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { useSocket } from "@/boot/socket.service";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import UploadFile from "@/components/Gallery/Dialogs/UploadFile.vue";
import OCRScanned from "@/components/Gallery/Dialogs/OCRScanned.vue";
import UploadEditor from "@/components/Gallery/Dialogs/UploadEditor.vue";

const page = ref(1);
const loading = ref(false);
const items = ref<Upload[]>([]);
const pager = ref<Pager | null>(null);
const appStore = useAppStore();
const selected: Ref<number[]> = ref([]);
const collectionsStore = useCollectionsStore();
const search = ref("");

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

// Socket handler
useSocket.gallery.on("update", (data: Upload[]) => {
  items.value = items.value.map((item) => {
    const matchingUpload = data.find((upload) => upload.id === item.id);
    if (matchingUpload) {
      return {
        ...item,
        name: matchingUpload.name,
        textMetadata: matchingUpload.textMetadata,
        collections: matchingUpload.collections
      };
    }
    return item;
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
</script>

<style scoped></style>
