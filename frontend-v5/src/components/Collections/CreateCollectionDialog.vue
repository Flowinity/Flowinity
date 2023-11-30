<template>
  <tpu-dialog
    :model-value="modelValue"
    width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      {{ t("collections.create.title") }}
    </template>
    <div class="py-4 px-4 relative">
      <text-field
        v-model="name"
        autofocus
        :label="t('collections.settings.name')"
        class="mb-2"
        @keyup.enter="createCollection"
      />
    </div>
    <card-actions>
      <tpu-button
        variant="passive"
        :loading="loading"
        @click="createCollection"
      >
        {{ t("collections.create.create") }}
      </tpu-button>
    </card-actions>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref } from "vue";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { CreateCollectionMutation } from "@/graphql/collections/createCollection.graphql";
import { useRouter } from "vue-router";
const name = ref("");
const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();
const loading = ref(false);
const router = useRouter();

async function createCollection() {
  if (loading.value) return;
  loading.value = true;
  try {
    const {
      data: { createCollection }
    } = await useApolloClient().client.mutate({
      mutation: CreateCollectionMutation,
      variables: {
        input: {
          name: name.value
        }
      }
    });
    emit("update:modelValue", false);
    router.push(`/collections/${createCollection.id}`);
  } finally {
    loading.value = false;
  }
}
</script>
