<template>
  <div>
    <div
      class="flex items-center pt-0 dark:border-outline-dark border-b-2 border-outline-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <RiSearchLine class="w-8 ml-3" />
      <text-field
        v-model="search"
        class="ml-2 w-full"
        style="border-bottom: none; margin-top: 0; margin-bottom: 0"
        placeholder="Search..."
        :persistent-placeholder="true"
        ref="searchInput"
        @keydown.escape="chatStore.uiOptions.searchSidebar = false"
      >
        <div class="flex items-end justify-end mr-2">
          <tpu-button
            variant="passive"
            style="width: 42px"
            @click="chatStore.uiOptions.searchSidebar = false"
            icon
          >
            <RiCloseLine />
          </tpu-button>
        </div>
      </text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useChatStore } from "@/stores/chat.store";
import TpuSmartTextField from "@/components/Framework/Input/TpuSmartTextField.vue";
import { useRoute } from "vue-router";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
const search = ref("");
const { t } = useI18n();
const searchInput = ref<InstanceType<typeof TextField>>();
const chatStore = useChatStore();

watch(
  () => chatStore.uiOptions.searchSidebar,
  async (value) => {
    if (value) {
      await nextTick();
      searchInput.value?.input?.focus();
    }
  }
);

const route = useRoute();
watch(
  () => route.params.id,
  () => {
    chatStore.uiOptions.searchSidebar = false;
  }
);
</script>

<style scoped></style>
