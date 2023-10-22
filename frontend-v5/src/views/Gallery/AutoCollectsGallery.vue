<template>
  <gallery
    :path="`/auto-collects/${route.params.id}`"
    :name="`${collection?.name} AutoCollects`"
    :type="GalleryType.AutoCollect"
    :id="id"
    ref="galleryComponent"
  >
    <template #extra-item-attributes="{ item }: { item: Upload }">
      <p>
        {{
          t("gallery.attributes.triggeredByRule", {
            rule: item.autoCollectApproval?.autoCollectRule?.name
          })
        }}
      </p>
    </template>
    <template #actions="{ item }">
      <tpu-button
        color="green"
        v-tooltip="t('gallery.actions.approve')"
        @click="
          actAutoCollect(
            [item.autoCollectApproval.id],
            AutoCollectAction.Approve
          )
        "
        :loading="loading"
      >
        <RiCheckLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        color="red"
        v-tooltip="t('gallery.actions.reject')"
        @click="
          actAutoCollect(
            [item.autoCollectApproval.id],
            AutoCollectAction.Reject
          )
        "
        :loading="loading"
      >
        <RiCloseLine style="width: 20px" />
      </tpu-button>
    </template>
    <template #appbar-options-selected="{ items, selected, emit }">
      <tpu-button
        color="green"
        v-tooltip.bottom="t('gallery.actions.approve')"
        @click="
          actAutoCollect(
            selected.map((item: number) => {
              const selectedItem = items.find((i: Upload) => i.id === item);
              return selectedItem?.autoCollectApproval?.id;
            }),
            AutoCollectAction.Approve
          );
          emit('select', []);
        "
        :loading="loading"
        variant="passive"
      >
        <RiCheckLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        color="red"
        v-tooltip.bottom="t('gallery.actions.reject')"
        @click="
          actAutoCollect(
            selected.map((item: number) => {
              const selectedItem = items.find((i: Upload) => i.id === item);
              return selectedItem?.autoCollectApproval?.id;
            }),
            AutoCollectAction.Reject
          );
          emit('select', []);
        "
        :loading="loading"
        variant="passive"
      >
        <RiCloseLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        icon
        variant="passive"
        v-tooltip.bottom="t('gallery.nav.deselectAll')"
        @click="emit('select', [])"
      >
        <RiCloseLine style="width: 20px" />
      </tpu-button>
      <tpu-button
        icon
        variant="passive"
        v-tooltip.bottom="t('gallery.nav.selectAll')"
        :disabled="
          items
            ?.map((item: Upload) => item.id)
            .every((id: number) => selected.includes(id))
        "
        @click="
          $emit(
            'select',
            items?.map((item: Upload) => item.id)
          )
        "
      >
        <RiAddLine style="width: 20px" />
      </tpu-button>
    </template>
    <template #appbar-options-unselected="{ items, emit }">
      <tpu-button
        icon
        variant="passive"
        v-tooltip.bottom="t('gallery.nav.selectAll')"
        @click="
          emit(
            'select',
            items?.map((item: Upload) => item.id)
          )
        "
      >
        <RiAddLine style="width: 20px" />
      </tpu-button>
    </template>
  </gallery>
</template>

<script setup lang="ts">
import Gallery from "@/views/Gallery/Gallery.vue";
import { useRoute, useRouter } from "vue-router";
import type { ComputedRef } from "vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { Collection, Upload } from "@/gql/graphql";
import {
  ActOnAutoCollectsDocument,
  AutoCollectAction,
  GalleryType
} from "@/gql/graphql";
import { useCollectionsStore } from "@/stores/collections.store";
import { isNumeric } from "@/plugins/isNumeric";
import { useAppStore } from "@/stores/app.store";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiShareForwardFill from "vue-remix-icons/icons/ri-share-forward-fill.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import { useI18n } from "vue-i18n";
import RiCheckLine from "vue-remix-icons/icons/ri-check-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import { useApolloClient } from "@vue/apollo-composable";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";

const collectionsStore = useCollectionsStore();
const collection = ref<Collection | null>(null);
const route = useRoute();
const appStore = useAppStore();
const { t } = useI18n();
const loading = ref(false);
const galleryComponent = ref<InstanceType<typeof Gallery> | null>(null);
const router = useRouter();

async function actAutoCollect(items: number[], action: AutoCollectAction) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: ActOnAutoCollectsDocument,
      variables: {
        input: {
          items,
          action
        }
      }
    });
    console.log(galleryComponent.value);
    const data = await galleryComponent?.value?.getGallery();
    if (!data.items.length) await router.push("/auto-collects");
  } finally {
    loading.value = false;
  }
}

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

onUnmounted(() => {
  appStore.appBarImage = null;
});
</script>

<style scoped></style>
