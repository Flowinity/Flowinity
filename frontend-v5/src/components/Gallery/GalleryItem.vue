<template>
  <card
    :padding="false"
    class="flex flex-col h-full justify-between overflow-hidden overflow-ellipsis"
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
        <div class="flex mt-2 gap-4">
          <div class="flex flex-wrap gap-2">
            <tpu-button v-tooltip="$t('gallery.addToCollection')">
              <RiAddLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              v-for="collection in props.item.collections"
              :key="collection.id"
            >
              <RiCloseLine style="width: 20px" />
              <span class="mx-1">
                {{ collection.name }}
              </span>
            </tpu-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <card-actions position="center">
        <slot name="actions" :item="props.item">
          <tpu-button color="blue" v-tooltip="$t('gallery.actions.edit')">
            <RiEditLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            color="red"
            v-tooltip="$t('gallery.actions.delete')"
            @click="
              appStore.dialogs.gallery.delete.upload = props.item;
              appStore.dialogs.gallery.delete.value = true;
            "
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
          <tpu-button color="purple" v-tooltip="$t('gallery.actions.ocr')">
            <RiCharacterRecognitionLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            color="star"
            v-tooltip="$t('gallery.actions.star', props.item.starred ? 2 : 1)"
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

const appStore = useAppStore();
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

defineEmits(["select"]);
</script>

<style scoped></style>
