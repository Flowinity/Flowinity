<template>
  <delete-upload v-model="appStore.dialogs.gallery.delete.value" />
  <gallery-core :selected="selected" :items="items" @select="select($event)" />
  <tpu-pager v-model="page" :total-pages="pager?.totalPages || 1" />
</template>

<script setup lang="ts">
import type { GalleryInput, Upload, Pager } from "@/gql/graphql";
import { GalleryType } from "@/gql/graphql";
import { onMounted, type Ref, ref, watch } from "vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { useApolloClient } from "@vue/apollo-composable";
import TextField from "@/components/Core/Input/TextField.vue";
import TpuPager from "@/components/Core/Pager/TpuPager.vue";
import DeleteUpload from "@/components/Gallery/Dialogs/DeleteUpload.vue";
import { useAppStore } from "@/stores/app.store";

const page = ref(1);
const loading = ref(false);
const items = ref<Upload[]>([]);
const pager = ref<Pager | null>(null);
const appStore = useAppStore();
const selected: Ref<number[]> = ref([]);

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

async function getGallery() {
  loading.value = true;
  const {
    data: { gallery }
  } = await useApolloClient().client.query({
    query: GalleryQuery,
    variables: {
      input: {
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
  document.getElementById("app-area").scrollTop = 0;
}

watch(
  () => props.type,
  () => {
    getGallery();
  }
);

watch(
  () => [page.value, props.id],
  () => {
    getGallery();
  }
);
</script>

<style scoped></style>
