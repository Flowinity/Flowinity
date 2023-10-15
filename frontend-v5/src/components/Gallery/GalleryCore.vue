<template>
  <div
    class="grid md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 2xl:grid-cols-4 sm:grid-cols-1 gap-4 p-4"
  >
    <gallery-item
      :selected="selected"
      @select="$emit('select', item.id)"
      v-for="item in props.items"
      :item="item"
      :key="item.id"
    />
  </div>
  <teleport to="#appbar-options">
    <transition mode="out-in" name="slide-up" appear>
      <template v-if="!selected.length">
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('gallery.nav.selectAll')"
          @click="
            $emit(
              'select',
              props.items?.map((item) => item.id)
            )
          "
        >
          <RiAddLine style="width: 20px" />
        </tpu-button>
      </template>
      <div class="flex gap-2" v-else>
        <tpu-button
          icon
          variant="passive"
          color="red"
          v-tooltip.bottom="t('gallery.nav.delete')"
        >
          <RiDeleteBinLine style="width: 20px" />
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          color="blue"
          v-tooltip.bottom="t('gallery.addToCollection')"
        >
          <RiImageAddLine style="width: 20px" />
        </tpu-button>

        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('gallery.nav.deselectAll')"
          @click="$emit('select', [])"
        >
          <RiCloseLine style="width: 20px" />
        </tpu-button>
        <tpu-button
          icon
          variant="passive"
          v-tooltip.bottom="t('gallery.nav.selectAll')"
          :disabled="
            props.items
              ?.map((item) => item.id)
              .every((id) => selected.includes(id))
          "
          @click="
            $emit(
              'select',
              props.items?.map((item) => item.id)
            )
          "
        >
          <RiAddLine style="width: 20px" />
        </tpu-button>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import type { Upload } from "@/gql/graphql";
import RiImageAddLine from "vue-remix-icons/icons/ri-image-add-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";

import TpuButton from "@/components/Core/Button/TpuButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  items: {
    type: Object as () => Upload[]
  },
  selected: {
    type: Object as () => Number[],
    required: true
  }
});
</script>

<style scoped></style>
