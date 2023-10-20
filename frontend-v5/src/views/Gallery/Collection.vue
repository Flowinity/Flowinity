<template>
  <collection-settings v-model="settings" />
  <collection-sharing v-model="sharing" />
  <gallery
    :path="`/collections/${route.params.id}`"
    :name="`${collection?.name} Collection`"
    :type="GalleryType.Collection"
    :id="id"
  >
    <template #extra-item-attributes="{ item }: { item: Upload }">
      <p>
        {{
          t("gallery.attributes.createdBy", {
            name: item.user?.username
          })
        }}
      </p>
    </template>
  </gallery>
  <teleport to="#appbar-options-first">
    <transition mode="out-in" name="slide-up" appear>
      <div class="flex gap-2">
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('collections.nav.banner')"
        >
          <RiImageEditLine style="width: 20px" />
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('collections.nav.share')"
          @click="sharing = true"
        >
          <RiShareForwardFill style="width: 20px" />
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('collections.nav.settings')"
          @click="settings = true"
        >
          <RiSettings5Line style="width: 20px" />
        </tpu-button>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import Gallery from "@/views/Gallery/Gallery.vue";
import { useRoute } from "vue-router";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { Collection } from "@/gql/graphql";
import { GalleryType, Upload } from "@/gql/graphql";
import { useCollectionsStore } from "@/stores/collections.store";
import { isNumeric } from "@/plugins/isNumeric";
import type { ComputedRef } from "vue";
import { useAppStore } from "@/stores/app.store";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import RiShareForwardFill from "vue-remix-icons/icons/ri-share-forward-fill.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import { useI18n } from "vue-i18n";
import TpuDivider from "@/components/Core/Divider/TpuDivider.vue";
import CollectionSettings from "@/components/Collections/CollectionSettings.vue";
import { useSocket } from "@/boot/socket.service";
import RiImageEditLine from "vue-remix-icons/icons/ri-image-edit-line.vue";
import CollectionSharing from "@/components/Collections/CollectionSharing.vue";
const collectionsStore = useCollectionsStore();
const collection = ref<Collection | null>(null);
const route = useRoute();
const appStore = useAppStore();
const { t } = useI18n();
const settings = ref(false);
const sharing = ref(false);
const id: ComputedRef<number | string> = computed(() => {
  const rid = <string>route.params.id;
  return isNumeric(rid) ? (typeof rid === "number" ? rid : parseInt(rid)) : rid;
});

const banner = computed(() => {
  if (collection.value?.image) {
    return appStore.domain + collection.value.image;
  } else if (collection.value?.preview?.attachment?.attachment) {
    return appStore.domain + collection.value.preview.attachment.attachment;
  } else {
    return "https://i.troplo.com/i/a050d6f271c3.png";
  }
});

watch(
  () => banner.value,
  (val) => {
    console.log("updated banner");
    appStore.appBarImage = val;
  }
);

onMounted(async () => {
  collection.value = await collectionsStore.getCollection(id.value);
});

watch(
  () => route.params.id,
  async () => {
    if (!id.value) {
      appStore.appBarImage = null;
      return;
    }
    collection.value = await collectionsStore.getCollection(id.value);
  }
);

function onCollectionUpdate(data: { id: number; name: string }) {
  if (data.id !== collection.value?.id) return;
  collectionsStore.getCollection(id.value);
}

onMounted(() => {
  useSocket.gallery.on("collectionUpdate", onCollectionUpdate);
});

onUnmounted(() => {
  appStore.appBarImage = null;
  useSocket.gallery.off("collectionUpdate", onCollectionUpdate);
});
</script>

<style scoped></style>
