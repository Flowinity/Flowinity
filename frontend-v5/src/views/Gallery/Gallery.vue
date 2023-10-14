<template>
  <text-field label="dee" v-model="deez" />
  <gallery-core :items="items" />
</template>

<script setup lang="ts">
import type { GalleryInput, Upload, Pager } from "@/gql/graphql";
import { GalleryType } from "@/gql/graphql";
import { onMounted, ref } from "vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { useApolloClient } from "@vue/apollo-composable";
import TextField from "@/components/Core/Input/TextField.vue";

const page = ref(1);
const loading = ref(false);
const items = ref<Upload[]>([]);
const pager = ref<Pager | null>(null);
const deez = ref("");
async function getGallery() {
  loading.value = true;
  const {
    data: { gallery }
  } = await useApolloClient().client.query({
    query: GalleryQuery,
    variables: {
      input: {
        page: page.value,
        type: props.type
      }
    },
    fetchPolicy: "network-only"
  });
  items.value = gallery.items;
  pager.value = gallery.pager;
  loading.value = false;
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
    type: Number
  }
});

onMounted(() => {
  getGallery();
});
</script>

<style scoped></style>
