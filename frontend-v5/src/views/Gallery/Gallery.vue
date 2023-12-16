<template>
  <upload-editor v-model="appStore.dialogs.gallery.edit.value" />
  <OCRScanned v-model="appStore.dialogs.gallery.ocr.value" />
  <upload-file v-model="appStore.dialogs.gallery.upload.value" />
  <add-to-collection
    v-model="appStore.dialogs.gallery.collect.value"
    :remove="appStore.dialogs.gallery.collect.remove"
    @selected="selected = $event"
  />
  <delete-upload v-model="appStore.dialogs.gallery.delete.value" />
  <gallery-navigation
    v-model:search="search"
    @refresh="getGallery()"
    v-model:filter="filter"
    v-model:sort="sort"
    v-model:order="order"
    :types="types"
    ref="galleryNav"
  />
  <gallery-core
    :id="id"
    :loading="loading"
    :type="type"
    ref="galleryCore"
    :selected="selected"
    :items="items"
    @select="select($event)"
    v-memo="[items, selected, loading]"
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
          t("gallery.attributes.starredAt", {
            date: dayjs(item?.starred?.createdAt).format(
              "Do of MMMM YYYY, h:mm A"
            )
          })
        }}
      </p>

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
import { computed, onMounted, onUnmounted, type Ref, ref, watch } from "vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import {
  useApolloClient,
  useSubscription,
  UseSubscriptionReturn
} from "@vue/apollo-composable";
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
import dayjs from "@/plugins/dayjs";
import TextField from "@/components/Framework/Input/TextField.vue";
import { UploadsSubscription } from "@/graphql/gallery/subscriptions/createUploads.graphql";

const { t } = useI18n();
const page = ref(1);
const loading = ref(false);
const items = ref<Upload[]>([]);
const pager = ref<Pager | null>(null);
const appStore = useAppStore();
const selected: Ref<Upload[]> = ref([]);
const collectionsStore = useCollectionsStore();
const search = ref("");
const filter = ref([GalleryFilter.IncludeMetadata]);
const sort = ref(GallerySort.CreatedAt);
const order = ref(GalleryOrder.Desc);
const galleryCore = ref<InstanceType<typeof GalleryCore> | null>(null);
const galleryNav = ref<InstanceType<typeof GalleryNavigation> | null>(null);

function select(upload: Upload | Upload[]) {
  if (Array.isArray(upload)) {
    if (!upload.length) return (selected.value = []);
    for (const add of upload) {
      if (!selected.value.find((item) => item.id === add.id)) {
        selected.value.push(add);
      }
    }
  } else {
    const index = selected.value.findIndex((item) => item.id === upload.id);
    if (index === -1) {
      selected.value.push(upload);
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
  generateSubscription();
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

function focusInput() {
  galleryNav.value?.galleryInput.input.input.focus();
}

function shortcutHandler(e: KeyboardEvent) {
  if (e.altKey && (e.key === "a" || e.key === "A")) {
    if (!selected.value.length) return;
    appStore.dialogs.gallery.collect.remove = e.shiftKey;
    appStore.dialogs.gallery.collect.items = selected.value;
    appStore.dialogs.gallery.collect.value =
      !appStore.dialogs.gallery.collect.value;
  }
  if (e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA") return;
  if (e.ctrlKey && e.key === "a") {
    e.preventDefault();
    if (
      items.value
        ?.map((item) => item.id)
        .every((id) => selected.value.some((item) => item.id === id))
    ) {
      selected.value = [];
    } else {
      selected.value = [...items.value];
    }
  } else if (
    (e.key === "v" && e.ctrlKey) ||
    (e.target?.tagName !== "INPUT" &&
      e.target?.tagName !== "TEXTAREA" &&
      !e.ctrlKey &&
      !e.altKey)
  ) {
    focusInput();
  }
}

onMounted(() => {
  getGallery();
  document.addEventListener("keydown", shortcutHandler);
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcutHandler);
});

function resetScroll() {
  document.getElementById("app-area")!.scrollTop = 0;
}

watch(
  () => [props.type, props.id],
  () => {
    page.value = 1;
    search.value = "";
    selected.value = [];
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
      if (
        props.type === GalleryType.Collection &&
        !upload.collections?.some((collection) => collection.id === props.id) &&
        upload.collections
      ) {
        return (items.value = items.value.filter(
          (item) => item.id !== upload.id
        ));
      }

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
let createSubscription: null | UseSubscriptionReturn<any, any> = null;

function generateSubscription() {
  createSubscription?.stop();
  createSubscription = useSubscription(UploadsSubscription, {
    input: {
      type: props.type,
      collectionId: typeof props.id === "number" ? props.id : undefined
    }
  });
}

watch(
  () => createSubscription?.result,
  (res) => {
    if (page.value !== 1) return;
    items.value = [...res.value.data.createUpload.upload, ...items.value];
  }
);

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
      name: "Undeletable",
      internalName: GalleryFilter.OnlyUndeletable
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
  } else if (props.type !== GalleryType.Collection) {
    types.splice(1, 0, {
      name: "Not collectivized",
      internalName: GalleryFilter.NoCollection
    });
  }
  return types;
});
</script>

<style scoped></style>
