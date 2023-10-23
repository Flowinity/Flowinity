<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
    @keydown.esc="$emit('update:modelValue', false)"
  >
    <template #toolbar>
      {{
        t(`gallery.dialogs.collect.title${remove ? "Remove" : "Add"}`, {
          count: appStore.dialogs.gallery.collect.items.length
        })
      }}
    </template>
    <template #default>
      <p class="my-4 mx-4">
        <tpu-auto-complete
          v-model="selectedCollection"
          autofocus
          label="Select a Collection"
          v-if="modelValue"
          :items="items"
          @keydown.enter="add"
        />
      </p>
      <card-actions>
        <tpu-button variant="passive" @click="add" :loading="loading">
          {{ t(remove ? "generic.remove" : "generic.add") }}
        </tpu-button>
      </card-actions>
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app.store";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { computed, ref, watch } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { useToast } from "vue-toastification";
import TpuAutoComplete from "@/components/Framework/Input/TpuAutoComplete.vue";
import { Upload } from "@/gql/graphql";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean,
  remove: Boolean
});
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const emit = defineEmits(["update:modelValue", "addToCollection", "selected"]);
const selectedCollection = ref(0);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    if (props.remove)
      return (selectedCollection.value = collectionsStore.selected?.id || 0);
    selectedCollection.value = 0;
  }
);

const items = computed(() => {
  if (!props.remove) return collectionsStore.writable;

  const uniqueCollectionIds = new Set();
  return appStore.dialogs.gallery.collect.items.flatMap((item: Upload) => {
    return item.collections.filter((collection) => {
      if (!uniqueCollectionIds.has(collection.id)) {
        uniqueCollectionIds.add(collection.id);
        return true;
      }
      return false;
    });
  });
});

async function add() {
  try {
    if (!selectedCollection.value) return;
    loading.value = true;
    let data = null;
    if (props.remove) {
      data = await collectionsStore.removeFromCollection(
        selectedCollection.value,
        appStore.dialogs.gallery.collect.items.map((item: Upload) => item.id)
      );
    } else {
      data = await collectionsStore.addToCollection(
        selectedCollection.value,
        appStore.dialogs.gallery.collect.items.map((item: Upload) => item.id)
      );
    }
    const success =
      data?.data?.removeFromCollection ||
      data?.data?.addToCollection?.length ||
      0;
    console.log(success, data);
    const failed =
      appStore.dialogs.gallery.collect.items.map((item: Upload) => item.id)
        .length - success;
    emit("update:modelValue", false);
    if (success === 0) {
      useToast().error("All items failed to collectivize.");
    } else {
      useToast().success(
        props.remove
          ? `Successfully removed ${success} items from ${collectionsStore.items.find(
              (collection) => collection.id === selectedCollection.value
            )?.name}.`
          : `Successfully added ${data?.data?.addToCollection
              ?.length} items to ${collectionsStore.items.find(
              (collection) => collection.id === selectedCollection.value
            )?.name}.`
      );

      if (failed >= 1)
        useToast().error(
          `However, ${failed} items failed to ${
            props.remove ? "remove" : "collectivize"
          }.`
        );
    }
    emit("selected", []);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
