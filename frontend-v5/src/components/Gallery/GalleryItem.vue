<template>
  <card
    :padding="false"
    class="flex flex-col h-full relative justify-between overflow-hidden overflow-ellipsis"
  >
    <div class="w-full">
      <tpu-toolbar
        class="flex justify-between items-center px-4"
        :class="{
          'cursor-pointer select-none': selected.length
        }"
        @click="selected.length ? $emit('select') : () => {}"
      >
        <p class="flex-grow" style="white-space: nowrap; overflow: hidden">
          {{ props.item.name }}
        </p>
        <tpu-button
          icon
          variant="passive"
          @click.prevent.stop="$emit('select')"
        >
          <RiCircleLine
            v-if="!selected.find((i) => i.id === props.item?.id)"
            style="max-width: 20px; min-width: 20px"
          />
          <RiCheckboxCircleFill
            v-else
            style="max-width: 20px; min-width: 20px"
          ></RiCheckboxCircleFill>
        </tpu-button>
      </tpu-toolbar>

      <gallery-preview :item="props.item" />

      <div class="p-4 text-medium-emphasis-dark text-sm">
        <slot />
        <p>
          Original name:
          {{ props.item.originalFilename }}
        </p>
        <p>Uploaded name: {{ props.item.attachment }}</p>
        <p>Size: {{ functions.fileSize(props.item.fileSize) }}</p>
        <p>
          Type:
          {{
            props.item.type === "binary"
              ? "Unknown"
              : functions.charUp(props.item.type)
          }}
        </p>
        <p>
          Created at:
          {{ dayjs(props.item.createdAt).format("Do of MMMM YYYY, h:mm A") }}
        </p>
        <slot name="extra-item-attributes" :item="props.item"></slot>
      </div>
    </div>
    <div>
      <div class="pl-2 text-medium-emphasis-dark text-sm">
        <div class="flex mt-2 gap-4">
          <tpu-slide-group
            :key="
              props.item.collections
                .map((collection) => collection.id)
                .join(',')
            "
            class="gap-2 mb-1"
          >
            <tpu-button
              v-if="props.item.userId === userStore.user?.id"
              v-tooltip="$t('gallery.addToCollection')"
              @click="
                appStore.dialogs.gallery.collect.remove = false;
                appStore.dialogs.gallery.collect.items = [props.item];
                appStore.dialogs.gallery.collect.value = true;
              "
            >
              <RiAddLine style="width: 20px" />
            </tpu-button>
            <a
              v-for="collection in props.item.collections"
              :key="collection.id"
              :href="`/collections/${collection.id}`"
              @click.prevent.stop
            >
              <tpu-button :to="`/collections/${collection.id}`">
                <RiCloseLine
                  style="width: 20px"
                  @click.prevent="
                    toast.success(
                      `Successfully removed the item from ${collection.name}`
                    );
                    collectionsStore.removeFromCollection(collection.id, [
                      props.item.id
                    ]);
                  "
                />
                <span class="mx-1">
                  {{ collection.name }}
                </span>
              </tpu-button>
            </a>
          </tpu-slide-group>
        </div>
      </div>
      <card-actions position="center">
        <slot name="actions" :item="props.item">
          <tpu-button
            v-if="props.item?.userId === userStore.user?.id"
            v-tooltip="$t('gallery.actions.edit')"
            color="blue"
            icon
            @click="
              appStore.dialogs.gallery.edit.upload = props.item;
              appStore.dialogs.gallery.edit.value = true;
            "
          >
            <RiEditLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            v-if="props.item?.userId === userStore.user?.id"
            v-tooltip="$t('gallery.actions.delete')"
            color="red"
            icon
            :disabled="!item.deletable"
            @click.exact="
              appStore.dialogs.gallery.delete.upload = props.item;
              appStore.dialogs.gallery.delete.value = true;
            "
            @click.shift.exact="galleryStore.deleteUploads([props.item?.id])"
          >
            <RiDeleteBinLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            v-tooltip="$t('gallery.actions.copy')"
            color="teal"
            icon
            @click="
              functions.copy(appStore.domain + props.item.attachment);
              toast.success(t('generic.copied'));
            "
          >
            <RiFileCopyLine style="width: 20px" />
          </tpu-button>
          <tpu-button
            v-tooltip="$t('gallery.actions.download')"
            color="green"
            icon
            :href="appStore.domain + props.item.attachment"
            target="_blank"
          >
            <RiDownloadLine style="width: 20px" />
          </tpu-button>
          <span v-if="props.item.type === 'image'" v-tooltip="ocrStatus.text">
            <tpu-button
              icon
              color="purple"
              :disabled="!props.item.textMetadata"
              :loading="ocrStatus.status === 1"
              @click="
                appStore.dialogs.gallery.ocr.content = props.item.textMetadata;
                appStore.dialogs.gallery.ocr.value = true;
              "
              @click.right.prevent="
                functions.copy(props.item?.textMetadata || '');
                toast.success(t('generic.copied'));
              "
            >
              <component
                :is="
                  ocrStatus.status !== 2
                    ? RiCharacterRecognitionLine
                    : RiAlertLine
                "
                style="width: 20px"
              />
            </tpu-button>
          </span>

          <tpu-button
            v-if="userStore.user?.id"
            v-tooltip="$t('gallery.actions.star', props.item.starred ? 2 : 1)"
            icon
            color="star"
            :loading="loading"
            @click="starUpload"
          >
            <RiStarLine v-if="!props.item.starred" style="width: 20px" />
            <RiStarFill v-else style="width: 20px" />
          </tpu-button>
          <slot name="extra-actions" :item="props.item" />
        </slot>
      </card-actions>
    </div>
  </card>
</template>

<script setup lang="ts">
import type { Upload } from "@/gql/graphql";
import Card from "@/components/Framework/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import TpuToolbar from "@/components/Framework/Toolbar/TpuToolbar.vue";
import dayjs from "../../plugins/dayjs";
import functions from "../../plugins/functions";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiEditLine from "vue-remix-icons/icons/ri-edit-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiFileCopyLine from "vue-remix-icons/icons/ri-file-copy-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiDownloadLine from "vue-remix-icons/icons/ri-download-line.vue";
import RiCharacterRecognitionLine from "vue-remix-icons/icons/ri-character-recognition-line.vue";
import RiStarFill from "vue-remix-icons/icons/ri-star-fill.vue";
import RiStarLine from "vue-remix-icons/icons/ri-star-line.vue";
import RiCircleLine from "vue-remix-icons/icons/ri-circle-line.vue";
import RiCheckboxCircleFill from "vue-remix-icons/icons/ri-checkbox-circle-fill.vue";
import RiAlertLine from "vue-remix-icons/icons/ri-alert-line.vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import { computed, ref } from "vue";
import TpuSlideGroup from "@/components/Framework/SlideGroup/TpuSlideGroup.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { StarUploadMutation } from "@/graphql/gallery/starUpload";
import { useApolloClient } from "@vue/apollo-composable";
import { useGalleryStore } from "@/stores/gallery.store";
import { useUserStore } from "@/stores/user.store";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const galleryStore = useGalleryStore();
const userStore = useUserStore();
const toast = useToast();
const props = defineProps({
  item: {
    type: Object as () => Upload,
    required: true
  },
  selected: {
    type: Object as () => Upload[],
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

const { t } = useI18n();

const ocrStatus = computed(() => {
  if (props.item.type !== "image")
    return { status: 2, text: t("gallery.actions.ocrError") };
  return props.item.textMetadata === null
    ? dayjs().diff(dayjs(props.item.createdAt), "day") >= 1
      ? {
          status: 2,
          text: t("gallery.actions.ocrError")
        }
      : {
          status: 1,
          text: t("gallery.actions.ocrProcessing")
        }
    : {
        status: 0,
        text: t("gallery.actions.ocr")
      };
});

defineEmits(["select"]);
</script>

<style scoped></style>
