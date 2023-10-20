<template>
  <card
    :padding="false"
    class="flex flex-col h-full relative justify-between overflow-hidden overflow-ellipsis"
  >
    <div>
      <tpu-toolbar
        class="flex justify-between items-center"
        @click="selected.length ? $emit('select') : () => {}"
        :class="{
          'cursor-pointer select-none': selected.length
        }"
      >
        <p class="flex-grow" style="white-space: nowrap; overflow: hidden">
          {{ props.item.name }}
        </p>
        <tpu-button
          icon
          @click.prevent.stop="$emit('select')"
          variant="passive"
        >
          <RiCircleLine
            style="max-width: 20px; min-width: 20px"
            v-if="!selected.includes(props.item?.id)"
          />
          <RiCheckboxCircleFill
            v-else
            style="max-width: 20px; min-width: 20px"
          ></RiCheckboxCircleFill>
        </tpu-button>
      </tpu-toolbar>

      <gallery-preview :item="props.item" />

      <div class="p-4 text-medium-emphasis-dark text-sm">
        <p>
          Original name:
          {{ props.item.originalFilename }}
        </p>
        <p>Uploaded name: {{ props.item.attachment }}</p>
        <p>
          Created at:
          {{ dayjs(props.item.createdAt).format("Do of MMMM YYYY, h:mm A") }}
        </p>
        <p>Size: {{ functions.fileSize(props.item.fileSize) }}</p>
        <slot name="extra-item-attributes" :item="props.item"></slot>
      </div>
    </div>
    <div>
      <div class="pl-2 text-medium-emphasis-dark text-sm">
        <div class="flex mt-2 gap-4">
          <tpu-slide-group
            class="gap-2 mb-1"
            :key="
              props.item.collections
                .map((collection) => collection.id)
                .join(',')
            "
          >
            <tpu-button
              v-tooltip="$t('gallery.addToCollection')"
              @click="
                appStore.dialogs.gallery.collect.items = [props.item.id];
                appStore.dialogs.gallery.collect.value = true;
              "
            >
              <RiAddLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-for="collection in props.item.collections"
              :key="collection.id"
              :to="`/collections/${collection.id}`"
            >
              <RiCloseLine
                style="width: 20px"
                @click.prevent="
                  collectionsStore.removeFromCollection(collection.id, [
                    props.item.id
                  ])
                "
              />
              <span class="mx-1">
                {{ collection.name }}
              </span>
            </tpu-button>
          </tpu-slide-group>
        </div>
      </div>
      <card-actions position="center">
        <slot name="actions" :item="props.item">
          <tpu-button
            color="blue"
            v-tooltip="$t('gallery.actions.edit')"
            @click="
              appStore.dialogs.gallery.edit.upload = props.item;
              appStore.dialogs.gallery.edit.value = true;
            "
            v-if="props.item?.userId === userStore.user?.id"
          >
            <RiEditLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            color="red"
            v-tooltip="$t('gallery.actions.delete')"
            @click.exact="
              appStore.dialogs.gallery.delete.upload = props.item;
              appStore.dialogs.gallery.delete.value = true;
            "
            @click.shift.exact="galleryStore.deleteUploads([props.item?.id])"
            v-if="props.item?.userId === userStore.user?.id"
          >
            <RiDeleteBinLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            color="teal"
            v-tooltip="$t('gallery.actions.copy')"
            @click="functions.copy(appStore.domain + props.item.attachment)"
          >
            <RiFileCopyLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            color="green"
            v-tooltip="$t('gallery.actions.download')"
            :href="appStore.domain + props.item.attachment"
            target="_blank"
          >
            <RiDownloadLine style="width: 20px" />
          </tpu-button>
          <span
            v-tooltip="
              props.item.textMetadata === null
                ? $t('gallery.actions.ocrProcessing')
                : $t('gallery.actions.ocr')
            "
            v-if="props.item.type === 'image'"
          >
            <tpu-button
              color="purple"
              @click="
                appStore.dialogs.gallery.ocr.content = props.item.textMetadata;
                appStore.dialogs.gallery.ocr.value = true;
              "
              :disabled="!props.item.textMetadata"
              @click.right="functions.copy(props.item?.textMetadata)"
              :loading="props.item.textMetadata === null"
            >
              <RiCharacterRecognitionLine style="width: 20px" />
            </tpu-button>
          </span>

          <tpu-button
            color="star"
            v-tooltip="$t('gallery.actions.star', props.item.starred ? 2 : 1)"
            @click="starUpload"
            :loading="loading"
            v-if="userStore.user?.id"
          >
            <RiStarLine style="width: 20px" v-if="!props.item.starred" />
            <RiStarFill style="width: 20px" v-else />
          </tpu-button>
          <slot name="extra-actions" :item="props.item" />
        </slot>
      </card-actions>
    </div>
  </card>
</template>

<script setup lang="ts">
import type { Upload } from "@/gql/graphql";
import Card from "@/components/Core/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import TpuToolbar from "@/components/Core/Toolbar/TpuToolbar.vue";
import dayjs from "../../plugins/dayjs";
import functions from "../../plugins/functions";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import RiEditLine from "vue-remix-icons/icons/ri-edit-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiFileCopyLine from "vue-remix-icons/icons/ri-file-copy-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiDownloadLine from "vue-remix-icons/icons/ri-download-line.vue";
import RiCharacterRecognitionLine from "vue-remix-icons/icons/ri-character-recognition-line.vue";
import RiStarFill from "vue-remix-icons/icons/ri-star-fill.vue";
import RiStarLine from "vue-remix-icons/icons/ri-star-line.vue";
import RiFileLine from "vue-remix-icons/icons/ri-file-line.vue";
import RiCircleLine from "vue-remix-icons/icons/ri-circle-line.vue";
import RiCheckboxCircleFill from "vue-remix-icons/icons/ri-checkbox-circle-fill.vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import TpuDialog from "@/components/Core/Dialog/TpuDialog.vue";
import { ref } from "vue";
import TpuSlideGroup from "@/components/Core/SlideGroup/TpuSlideGroup.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { StarUploadMutation } from "@/graphql/gallery/starUpload";
import { useApolloClient } from "@vue/apollo-composable";
import { useGalleryStore } from "@/stores/gallery.store";
import { useUserStore } from "@/stores/user.store";
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const galleryStore = useGalleryStore();
const userStore = useUserStore();
const props = defineProps({
  item: {
    type: Object as () => Upload,
    required: true
  },
  selected: {
    type: Object as () => Number[],
    required: true
  }
});
const loading = ref(false);

async function starUpload() {
  try {
    loading.value = true;
    await useApolloClient().client.mutate({
      mutation: StarUploadMutation,
      variables: {
        input: {
          attachment: props.item?.attachment
        }
      }
    });
  } finally {
    loading.value = false;
  }
}

defineEmits(["select"]);
</script>

<style scoped></style>
