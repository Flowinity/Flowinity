<template>
  <collection-settings
    @refresh="refresh"
    v-model="settings"
    :collection="collection"
  />
  <collection-sharing v-model="sharing" :collection="collection" />
  <gallery
    :path="`/collections/${route.params.id}`"
    :name="`${collection?.name} Collection`"
    :type="GalleryType.Collection"
    :id="id"
  >
    <template #extra-item-attributes="{ item }: { item: Upload }">
      <p>
        {{
          t("gallery.attributes.addedAt", {
            date: dayjs(item?.item?.createdAt).format("Do of MMMM YYYY, h:mm A")
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
  </gallery>
  <teleport to="#appbar-options-first">
    <transition mode="out-in" name="slide-up" appear>
      <div class="flex gap-2">
        <transition appear v-if="collection?.shareLink">
          <tpu-button
            icon
            :key="!!collection?.shareLink"
            variant="passive"
            @click="
              functions.copy(
                `${appStore.state.hostnameWithProtocol}/collections/${collection?.shareLink}`
              );
              toast.success(t('generic.copied'));
            "
            v-tooltip.bottom="t('collections.nav.shareLink')"
          >
            <RiLink style="width: 20px" />
          </tpu-button>
        </transition>
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
import { Chat, GalleryType, Upload } from "@/gql/graphql";
import { useCollectionsStore } from "@/stores/collections.store";
import { isNumeric } from "@/plugins/isNumeric";
import type { ComputedRef } from "vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiShareForwardFill from "vue-remix-icons/icons/ri-share-forward-fill.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import { useI18n } from "vue-i18n";
import TpuDivider from "@/components/Framework/Divider/TpuDivider.vue";
import CollectionSettings from "@/components/Collections/CollectionSettings.vue";
import { useSocket } from "@/boot/socket.service";
import RiImageEditLine from "vue-remix-icons/icons/ri-image-edit-line.vue";
import CollectionSharing from "@/components/Collections/CollectionSharing.vue";
import SetPictureDialog from "@/components/Core/Dialogs/SetPictureDialog.vue";
import axios from "@/plugins/axios.ts";
import functions from "@/plugins/functions";
import { useToast } from "vue-toastification";
const collectionsStore = useCollectionsStore();
const collection = ref<Collection | undefined>(undefined);
const route = useRoute();
const appStore = useAppStore();
const { t } = useI18n();
const settings = ref(false);
const sharing = ref(false);
const id: ComputedRef<number | string> = computed(() => {
  const rid = <string>route.params.id;
  return isNumeric(rid) ? (typeof rid === "number" ? rid : parseInt(rid)) : rid;
});
const toast = useToast();
import RiLink from "vue-remix-icons/icons/ri-link.vue";
import dayjs from "@/plugins/dayjs";
import { h, markRaw } from "vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import RiCollageLine from "vue-remix-icons/icons/ri-collage-line.vue";
import RiCollageFill from "vue-remix-icons/icons/ri-collage-fill.vue";

const banner = computed(() => {
  if (!collection.value?.banner) return null;
  return appStore.domain + collection.value?.banner;
});

watch(
  () => banner.value,
  (val) => {
    appStore.appBarImage = val;
  }
);

onMounted(async () => {
  collection.value = await collectionsStore.getCollection(id.value);
});

function setAppBar() {
  appStore.currentNavItem = {
    item: {
      name: collection.value?.name || "Loading...",
      icon: collection.value?.avatar
        ? h(UserAvatar, {
            username: collection.value?.name,
            src: appStore.domain + collection.value?.avatar,
            size: 32,
            style: "margin: 0px 4px 0px 4px"
          })
        : markRaw(RiCollageLine),
      path: route.path,
      selectedIcon: markRaw(RiCollageFill)
    },
    rail: [
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.GALLERY
      )
    ]
  };
}

watch(
  () => collection.value?.name,
  (val) => {
    setAppBar();
  }
);

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

async function onCollectionUpdate(data: { id?: number; name?: string }) {
  if (data.id !== collection.value?.id) return;
  refresh();
}

async function onCollectionUserUpdate(data: {
  id?: number;
  collectionId: number;
}) {
  if (data.collectionId !== collection.value?.id) return;
  refresh();
}

async function refresh() {
  collection.value = await collectionsStore.getCollection(id.value);
}

onMounted(() => {
  useSocket.gallery.on("collectionUpdate", onCollectionUpdate);
  useSocket.gallery.on("collectionUserUpdate", onCollectionUserUpdate);
  useSocket.gallery.on("collectionUserAdd", onCollectionUserUpdate);
  useSocket.gallery.on("collectionUserRemove", onCollectionUserUpdate);
  setAppBar();
});

onUnmounted(() => {
  appStore.appBarImage = null;
  useSocket.gallery.off("collectionUpdate", onCollectionUpdate);
  useSocket.gallery.off("collectionUserUpdate", onCollectionUserUpdate);
  useSocket.gallery.off("collectionUserAdd", onCollectionUserUpdate);
  useSocket.gallery.off("collectionUserRemove", onCollectionUserUpdate);
});
</script>

<style scoped></style>
