<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{
        $t(`collections.add.title${remove ? "Remove" : "Add"}`, {
          count: props.items.length
        })
      }}
    </template>
    <v-card-text>
      <v-autocomplete
        v-model="selectedCollection"
        :items="collections"
        :autofocus="true"
        item-title="name"
        item-value="id"
        label="Select collection"
        outlined
        @keydown.enter="add"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn :color="remove ? 'red' : 'primary'" @click="add">
        {{ $t(remove ? "generic.remove" : "generic.add") }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script setup lang="ts">
import { Upload } from "@/gql/graphql";
import { computed, PropType, ref, watch } from "vue";
import { useCollectionsStore } from "@/store/collections.store";
import { useToast } from "vue-toastification";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

const props = defineProps({
  modelValue: Boolean,
  remove: Boolean,
  items: {
    type: Array as PropType<Upload[]>,
    default: () => []
  }
});
const collectionsStore = useCollectionsStore();
const emit = defineEmits(["update:modelValue", "addToCollection", "selected"]);
const selectedCollection = ref<number | null>(null);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    if (props.remove)
      return (selectedCollection.value = collectionsStore.selected?.id || null);
    selectedCollection.value = null;
  }
);

const collections = computed(() => {
  if (!props.remove) return collectionsStore.write;

  const uniqueCollectionIds = new Set();
  return props.items.flatMap((item: Upload) => {
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
        props.items.map((item: Upload) => item.id)
      );
    } else {
      data = await collectionsStore.addToCollection(
        selectedCollection.value,
        props.items.map((item: Upload) => item.id)
      );
    }
    const success =
      data?.data?.removeFromCollection ||
      data?.data?.addToCollection?.length ||
      0;
    console.log(success, data);
    const failed = props.items.map((item: Upload) => item.id).length - success;
    emit("update:modelValue", false);
    if (success === 0) {
      useToast().error("All items failed to collectivize.");
    } else {
      useToast().success(
        props.remove
          ? `Successfully removed ${success} items from ${
              collectionsStore.persistent.find(
                (collection) => collection.id === selectedCollection.value
              )?.name
            }.`
          : `Successfully added ${
              data?.data?.addToCollection?.length
            } items to ${
              collectionsStore.persistent.find(
                (collection) => collection.id === selectedCollection.value
              )?.name
            }.`
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
