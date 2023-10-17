<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
    @keydown.esc="$emit('update:modelValue', false)"
  >
    <template #toolbar>
      {{
        t("gallery.dialogs.collect.title", {
          count: appStore.dialogs.gallery.collect.items.length
        })
      }}
    </template>
    <template #default>
      <p class="my-4 mx-4">
        <tpu-select
          v-model="selectedCollection"
          autofocus
          label="Select a Collection"
          v-if="modelValue"
          :items="collectionsStore.items"
          @keydown.enter="add"
        />
      </p>
      <card-actions>
        <tpu-button
          color="blue"
          variant="passive"
          @click="add"
          :loading="loading"
        >
          {{ t("generic.add") }}
        </tpu-button>
      </card-actions>
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Core/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app.store";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import TextField from "@/components/Core/Input/TextField.vue";
import TpuSelect from "@/components/Core/Input/TpuSelect.vue";
import { ref } from "vue";
import { useCollectionsStore } from "@/stores/collections.store";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const emit = defineEmits(["update:modelValue", "addToCollection"]);
const selectedCollection = ref(0);
const loading = ref(false);

async function add() {
  try {
    loading.value = true;
    await collectionsStore.addToCollection(
      selectedCollection.value,
      appStore.dialogs.gallery.collect.items
    );
    emit("update:modelValue", false);
    emit("addToCollection", {
      collectionId: selectedCollection.value,
      items: appStore.dialogs.gallery.collect.items
    });
    useToast().success(
      `Successfully added ${
        appStore.dialogs.gallery.collect.items.length
      } items to ${collectionsStore.items.find(
        (collection) => collection.id === selectedCollection.value
      )?.name}.`
    );
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
