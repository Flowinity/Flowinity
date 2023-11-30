<template>
  <tpu-dialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ t("collections.settings.title") }}
    </template>
    <div class="py-4 px-4 relative">
      <text-field
        v-model="name"
        autofocus
        :label="t('collections.settings.name')"
        class="mb-2"
      />
      <div class="flex relative gap-3 justify-center">
        <div>
          <user-avatar
            :key="collection?.avatar || ''"
            :username="name"
            :edit="true"
            :src="'/i/' + collection?.avatar"
            :size="100"
            @set-image="uploadAvatar"
          />
          <div
            v-if="collection?.avatar"
            class="text-center text-medium-emphasis-dark cursor-pointer mt-1"
            @click="removeAttribute('avatar')"
          >
            {{ t("generic.remove") }}
          </div>
        </div>
        <div>
          <div class="relative cursor-pointer" @click="banner = true">
            <tpu-hover v-slot="{ hovering }">
              <div
                class="banner-example flex-grow"
                style="padding: 1px 1px 1px 1px"
              >
                <tpu-img
                  cover
                  class="rounded-xl"
                  style="width: 100%; height: 100%"
                  :src="`/i/${collection?.banner}`"
                ></tpu-img>
              </div>
              <tpu-overlay
                :overlay-classes="{ 'rounded-xl': true }"
                absolute
                :model-value="hovering"
              >
                <RiUploadLine style="width: 40px" />
              </tpu-overlay>
            </tpu-hover>
          </div>
          <div
            v-if="collection?.image"
            class="text-center text-medium-emphasis-dark cursor-pointer mt-1"
            @click="removeAttribute('banner')"
          >
            {{ t("generic.remove") }}
          </div>
        </div>
      </div>
    </div>
    <card-actions>
      <tpu-button
        variant="passive"
        :loading="loading"
        @click="updateCollection"
      >
        Save
      </tpu-button>
    </card-actions>
  </tpu-dialog>
  <set-picture-dialog
    v-model="banner"
    :aspect-ratio="157 / 29"
    @set-image="uploadBanner"
  />
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import TextField from "@/components/Framework/Input/TextField.vue";
import { onMounted, ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";
import { Collection } from "@/gql/graphql";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import TpuHover from "@/components/Framework/Hover/TpuHover.vue";
import TpuOverlay from "@/components/Framework/Overlay/TpuOverlay.vue";
import RiUploadLine from "vue-remix-icons/icons/ri-upload-cloud-2-line.vue";
import SetPictureDialog from "@/components/Core/Dialogs/SetPictureDialog.vue";
import axios from "@/plugins/axios";
const name = ref("");
const props = defineProps({
  modelValue: Boolean,
  collection: Object as () => Collection
});
const emit = defineEmits(["update:modelValue", "refresh"]);
const { t } = useI18n();
const collectionStore = useCollectionsStore();
const loading = ref(false);
const banner = ref(false);
watch(
  () => collectionStore.selected,
  (val) => {
    name.value = val?.name ?? "";
  }
);

async function updateCollection() {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: UpdateCollectionMutation,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          name: name.value
        }
      }
    });
    emit("update:modelValue", false);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  name.value = collectionStore.selected?.name ?? "";
});

async function uploadBanner(blob: Blob) {
  const formData = new FormData();
  formData.append("banner", blob);
  await axios.post(`/collections/${props.collection?.id}/banner`, formData);
  banner.value = false;
  emit("refresh");
}

async function uploadAvatar(blob: Blob, callback: () => {}) {
  const formData = new FormData();
  formData.append("avatar", blob);
  await axios.post(`/collections/${props.collection?.id}/avatar`, formData);
  emit("refresh");
  if (callback) callback();
}

async function removeAttribute(key: "banner" | "avatar") {
  await axios.delete(`/collections/${props.collection?.id}/${key}`);
  emit("refresh");
}
</script>

<style scoped>
.banner-example {
  height: 100px;
  width: 335px;
  border-spacing: 15px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
</style>
