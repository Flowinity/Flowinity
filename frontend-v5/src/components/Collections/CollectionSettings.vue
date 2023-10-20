<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="400"
  >
    <template #toolbar>
      {{ t("collections.settings.title") }}
    </template>
    <div class="py-4 px-4">
      <text-field
        autofocus
        v-model="name"
        :label="t('collections.settings.name')"
      />
    </div>
    <card-actions>
      <tpu-button
        color="blue"
        variant="passive"
        :loading="loading"
        @click="updateCollection"
      >
        Save
      </tpu-button>
    </card-actions>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Core/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import TextField from "@/components/Core/Input/TextField.vue";
import { ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";

const name = ref("");
const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();
const collectionStore = useCollectionsStore();
const loading = ref(false);
watch(
  () => collectionStore.selected?.name,
  (val) => {
    name.value = val;
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
</script>

<style scoped></style>
