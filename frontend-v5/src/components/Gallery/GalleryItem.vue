<template>
  <card :padding="false" class="flex flex-col h-full justify-between">
    <div>
      <tpu-toolbar>
        {{ props.item.name }}
      </tpu-toolbar>
      <tpu-img
        :src="appStore.domain + props.item?.attachment"
        height="150"
        class="justify-center items-center flex"
      />

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
          <tpu-button>
            <RiAddLine style="width: 20px" />
            <span class="mx-1">Add to Collection</span>
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
    <div class="mb-2">
      <card-actions position="center">
        <tpu-button color="blue">
          <RiEditLine style="width: 20px" />
        </tpu-button>
        <tpu-button color="red">
          <RiDeleteBinLine style="width: 20px" />
        </tpu-button>
        <tpu-button color="teal">
          <RiFileCopyLine style="width: 20px" />
        </tpu-button>
        <tpu-button color="green">
          <RiDownloadLine style="width: 20px" />
        </tpu-button>
        <tpu-button color="purple">
          <RiCharacterRecognitionLine style="width: 20px" />
        </tpu-button>
        <tpu-button color="star">
          <RiStarLine style="width: 20px" />
        </tpu-button>
      </card-actions>
    </div>
  </card>
</template>

<script setup lang="ts">
import type { Upload } from "@/gql/graphql";
import Card from "@/components/Core/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import TpuToolbar from "@/components/Core/Toolbar/TpuToolbar.vue";
import TpuImg from "@/components/Core/Image/TpuImg.vue";
import dayjs from "../../plugins/dayjs";
import functions from "../../plugins/functions";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import {
  RiEditLine,
  RiAddLine,
  RiCloseLine,
  RiFileCopyLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiCharacterRecognitionLine,
  RiStarFill,
  RiStarLine
} from "vue-remix-icons";

const appStore = useAppStore();
const props = defineProps({
  item: {
    type: Object as () => Upload,
    required: true
  }
});
</script>

<style scoped></style>
