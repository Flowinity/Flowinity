<template>
  <ApolloQuery
    :query="query"
    :variables="variables"
    class="my-4 mx-4"
    fetch-policy="network-only"
  >
    <template v-slot="{ result: { loading, error, data }, query }">
      <div v-if="loading" class="loading apollo">Loading...</div>

      <div v-else-if="error" class="error apollo">An error occurred</div>

      <div
        v-else-if="data?.[objKey]?.items?.length"
        class="result flex gap-4 flex-wrap"
      >
        <div v-for="item in data[objKey].items" :key="item.id">
          <tpu-image-card
            :src="collectionImage(item)"
            height="200"
            width="375"
            @click="
              $attrs.onClick === undefined
                ? $router.push(`/auto-collects/${item.id}`)
                : $attrs.onClick(item)
            "
            :ripple="$attrs.onClick === undefined"
            class="cursor-pointer"
            v-bind="$attrs"
          >
            <div class="select-none">
              <p>{{ item.name }}</p>
              <p class="text-sm">
                <slot name="subtitle" :item="item" :query="query">
                  {{ item.autoCollectApprovals.length }} pending approvals
                </slot>
              </p>
            </div>
          </tpu-image-card>
        </div>
      </div>

      <div v-else class="no-result apollo">
        <slot name="no-content">
          <tpu-no-content>
            <template #icon>
              <RiCheckboxMultipleFill />
            </template>
            <template #title>No pending approvals!</template>
            <template #description>
              <strong>AutoCollects</strong>
              can be configured via the
              <strong
                class="cursor-help underline"
                @click="
                  appStore.dialogs.tutorials.actionBar.value =
                    !appStore.dialogs.tutorials.actionBar.value
                "
              >
                Action Bar.
              </strong>
              <tpu-button class="flex justify-center mt-3" variant="outlined">
                Start the Tutorial
              </tpu-button>
            </template>
          </tpu-no-content>
        </slot>
      </div>
    </template>
  </ApolloQuery>

  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <slot name="options">
        <tpu-button variant="passive" icon to="/auto-collects/settings">
          <RiSettings5Line style="width: 20px" />
        </tpu-button>
      </slot>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { AutoCollectsQuery } from "@/graphql/autoCollects/getAutoCollects.graphql";
import TpuImageCard from "@/components/Framework/Card/TpuImageCard.vue";
import { useAppStore } from "@/stores/app.store";
import type { Collection } from "@/gql/graphql";
import TpuNoContent from "@/components/Framework/NoContent/TpuNoContent.vue";
import RiCheckboxMultipleFill from "vue-remix-icons/icons/ri-checkbox-multiple-fill.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { DocumentNode } from "graphql/language";
import { PropType } from "vue";
const appStore = useAppStore();

const props = defineProps({
  query: {
    type: Object as PropType<DocumentNode>,
    default: AutoCollectsQuery
  },
  variables: {
    type: Object,
    default: () => ({ input: {} })
  },
  objKey: {
    type: String,
    default: "autoCollects"
  }
});

function collectionImage(collection: Collection): string {
  console.log(collection);
  if (collection?.image) {
    return appStore.domain + collection.image;
  } else if (collection?.preview?.attachment?.attachment) {
    return appStore.domain + collection.preview.attachment.attachment;
  } else {
    return "https://i.troplo.com/i/a050d6f271c3.png";
  }
}
</script>

<style scoped></style>
