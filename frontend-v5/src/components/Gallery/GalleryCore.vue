<template>
  <div
    class="grid md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 2xl:grid-cols-4 sm:grid-cols-1 gap-4 p-4"
  >
    <template v-if="!loading">
      <div v-for="(item, index) in props.items" :key="item.id">
        <gallery-item
          :selected="selected"
          :item="item"
          @select="$emit('select', item)"
        >
          <p v-if="appStore.dev">Index: {{ index }}</p>
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </gallery-item>
      </div>
    </template>
    <template v-else>
      <tpu-skeleton-loader
        v-for="i in 24"
        :key="i"
        :types="[
          'toolbar',
          'image',
          'paragraph',
          'paragraph',
          'paragraph',
          'paragraph',
          'paragraph',
          'button'
        ]"
      />
    </template>
  </div>
  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <slot
        name="appbar-options"
        :items="props.items"
        :selected="selected"
        :emit="$emit"
      >
        <template v-if="!selected.length">
          <slot
            name="appbar-options-unselected"
            :items="props.items"
            :selected="selected"
            :emit="$emit"
          >
            <div class="flex gap-2">
              <tpu-button
                v-tooltip.bottom="t('gallery.nav.randomAttachment')"
                icon
                variant="passive"
                :loading="randomAttachmentLoading"
                @click="randomAttachment()"
              >
                <MdiDice style="width: 20px" />
              </tpu-button>
              <tpu-button
                v-tooltip.bottom="t('gallery.nav.selectAll')"
                icon
                variant="passive"
                @click="$emit('select', props.items)"
              >
                <RiAddLine style="width: 20px" />
              </tpu-button>
              <tpu-button
                v-tooltip.bottom="t('generic.upload')"
                icon
                variant="passive"
                @click="appStore.dialogs.gallery.upload.value = true"
              >
                <RiUploadLine style="width: 20px" />
              </tpu-button>
            </div>
          </slot>
        </template>
        <div v-else class="flex gap-2">
          <slot
            name="appbar-options-selected"
            :items="items"
            :selected="selected"
            :emit="$emit"
          >
            <tpu-button
              v-tooltip.bottom="t('gallery.nav.randomAttachment')"
              icon
              variant="passive"
              :loading="randomAttachmentLoading"
              @click="randomAttachment()"
            >
              <MdiDice style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-tooltip.bottom="t('gallery.nav.delete')"
              icon
              variant="passive"
              color="red"
              @click.exact="
                appStore.dialogs.gallery.delete.bulkIds = selected;
                appStore.dialogs.gallery.delete.value = true;
              "
              @click.shift.exact="
                galleryStore.deleteUploads(selected.map((item) => item.id))
              "
            >
              <RiDeleteBinLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-tooltip.bottom="
                appStore.shifting
                  ? t('gallery.removeFromCollection')
                  : t('gallery.addToCollectionBulk')
              "
              icon
              variant="passive"
              :color="appStore.shifting ? 'red' : 'blue'"
              @click="
                appStore.dialogs.gallery.collect.remove = appStore.shifting;
                appStore.dialogs.gallery.collect.items = selected;
                appStore.dialogs.gallery.collect.value = true;
              "
            >
              <component
                :is="appStore.shifting ? RiImageCloseLine : RiImageAddLine"
                style="width: 20px"
              />
            </tpu-button>
            <tpu-button
              v-tooltip.bottom="t('gallery.nav.deselectAll')"
              icon
              variant="passive"
              @click="$emit('select', [])"
            >
              <RiCloseLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-tooltip.bottom="t('gallery.nav.selectAll')"
              icon
              variant="passive"
              :disabled="
                props.items
                  ?.map((item) => item.id)
                  .every((id) => selected.some((item) => item.id === id))
              "
              @click="$emit('select', props.items)"
            >
              <RiAddLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-tooltip.bottom="t('generic.upload')"
              icon
              variant="passive"
              @click="appStore.dialogs.gallery.upload.value = true"
            >
              <RiUploadLine style="width: 20px" />
            </tpu-button>
          </slot>
        </div>
      </slot>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import type { Upload } from "@/gql/graphql";
import RiImageAddLine from "vue-remix-icons/icons/ri-image-add-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiUploadLine from "vue-remix-icons/icons/ri-upload-cloud-2-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import MdiDice from "@/components/Icons/MdiDice.vue";
import { useI18n } from "vue-i18n";
import { useApolloClient } from "@vue/apollo-composable";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import { GalleryOrder, GalleryType } from "@/gql/graphql";
import { ref } from "vue";
import functions from "@/plugins/functions";
import { useAppStore } from "@/stores/app.store";
import { useGalleryStore } from "@/stores/gallery.store";
import RiImageCloseLine from "@/components/Icons/RiImageCloseLine.vue";
import TpuSkeletonLoader from "@/components/Framework/SkeletonLoader/TpuSkeletonLoader.vue";

const { t } = useI18n();
const props = defineProps({
  items: {
    type: Object as () => Upload[]
  },
  selected: {
    type: Object as () => Upload[],
    required: true
  },
  type: {
    type: String as () => GalleryType,
    required: true
  },
  id: {
    type: [String, Number]
  },
  loading: Boolean
});

defineEmits(["select"]);

const randomAttachmentLoading = ref(false);
const appStore = useAppStore();
const galleryStore = useGalleryStore();

async function randomAttachment() {
  randomAttachmentLoading.value = true;
  const {
    data: { gallery }
  } = await useApolloClient().client.query({
    query: GalleryQuery,
    variables: {
      input: {
        page: 1,
        type: props.type,
        order: GalleryOrder.Random,
        limit: 1,
        collectionId: typeof props.id === "number" ? props.id : undefined,
        shareLink: typeof props.id === "string" ? props.id : undefined
      }
    },
    fetchPolicy: "network-only"
  });
  functions.copy(appStore.domain + gallery.items?.[0]?.attachment);
  randomAttachmentLoading.value = false;
}
</script>

<style scoped></style>
