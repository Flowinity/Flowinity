<template>
  <div
    class="grid md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 2xl:grid-cols-4 sm:grid-cols-1 gap-4 p-4"
  >
    <gallery-item
      :selected="selected"
      @select="$emit('select', item)"
      v-for="item in props.items"
      :item="item"
      :key="item.id"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </gallery-item>
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
                icon
                variant="passive"
                v-tooltip.bottom="t('gallery.nav.randomAttachment')"
                @click="randomAttachment()"
                :loading="randomAttachmentLoading"
              >
                <MdiDice style="width: 20px" />
              </tpu-button>
              <tpu-button
                icon
                variant="passive"
                v-tooltip.bottom="t('gallery.nav.selectAll')"
                @click="$emit('select', props.items)"
              >
                <RiAddLine style="width: 20px" />
              </tpu-button>
              <tpu-button
                icon
                variant="passive"
                v-tooltip.bottom="t('generic.upload')"
                @click="appStore.dialogs.gallery.upload.value = true"
              >
                <RiUploadLine style="width: 20px" />
              </tpu-button>
            </div>
          </slot>
        </template>
        <div class="flex gap-2" v-else>
          <slot
            name="appbar-options-selected"
            :items="items"
            :selected="selected"
            :emit="$emit"
          >
            <tpu-button
              icon
              variant="passive"
              v-tooltip.bottom="t('gallery.nav.randomAttachment')"
              @click="randomAttachment()"
              :loading="randomAttachmentLoading"
            >
              <MdiDice style="width: 20px" />
            </tpu-button>
            <tpu-button
              icon
              variant="passive"
              color="red"
              v-tooltip.bottom="t('gallery.nav.delete')"
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
              icon
              variant="passive"
              :color="appStore.shifting ? 'red' : 'blue'"
              @click="
                appStore.dialogs.gallery.collect.remove = appStore.shifting;
                appStore.dialogs.gallery.collect.items = selected;
                appStore.dialogs.gallery.collect.value = true;
              "
              v-tooltip.bottom="
                appStore.shifting
                  ? t('gallery.removeFromCollection')
                  : t('gallery.addToCollectionBulk')
              "
            >
              <component
                :is="appStore.shifting ? RiImageCloseLine : RiImageAddLine"
                style="width: 20px"
              />
            </tpu-button>
            <tpu-button
              icon
              variant="passive"
              v-tooltip.bottom="t('gallery.nav.deselectAll')"
              @click="$emit('select', [])"
            >
              <RiCloseLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              icon
              variant="passive"
              v-tooltip.bottom="t('gallery.nav.selectAll')"
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
              icon
              variant="passive"
              v-tooltip.bottom="t('generic.upload')"
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
  }
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
