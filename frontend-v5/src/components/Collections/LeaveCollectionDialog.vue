<template>
  <div>
    <tpu-dialog v-model="dialog">
      <template #toolbar>
        {{ t("collections.leave.title") }}
      </template>
      <template #default>
        <p class="my-4 mx-4">
          {{
            t("collections.leave.description", {
              collection: collection.name
            })
          }}
        </p>
        <card-actions>
          <tpu-button color="red" variant="passive" @click="leaveCollection">
            {{ t("collections.leave.action") }}
          </tpu-button>
        </card-actions>
      </template>
    </tpu-dialog>
    <slot
      :toggle="
        () => {
          dialog = true;
        }
      "
    ></slot>
  </div>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { DeleteUploadMutation } from "@/graphql/gallery/gallery.graphql";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { ComputedRef, ref } from "vue";
import { useToast } from "vue-toastification";
import { useGalleryStore } from "@/stores/gallery.store";
import { Collection } from "@/gql/graphql";
import { LeaveCollectionMutation } from "@/graphql/collections/leaveCollection.graphql";

const { t } = useI18n();
const props = defineProps({
  collection: Object as Collection
});
const loading = ref(false);
const dialog = ref(false);

async function leaveCollection() {
  loading.value = true;
  try {
    const mutate = useMutation(LeaveCollectionMutation, {
      variables: {
        input: {
          collectionId: props.collection.id
        }
      }
    });
    await mutate.mutate();
    dialog.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
