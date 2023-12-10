<template>
  <div class="widget w-full">
    <tpu-hover v-slot="{ hovering }" class="w-full relative">
      <home-widget-at-a-glance
        v-if="widget.type === HomeWidgetType.AtAGlance"
      />
      <home-widget-site-stats
        v-else-if="widget.type === HomeWidgetType.SiteStats"
      />
      <home-widget-announcements
        v-else-if="widget.type === HomeWidgetType.Announcements"
      />
      <home-widget-site-graph
        v-else-if="widget.type === HomeWidgetType.SiteStatsGraph"
      />
      <div v-else class="py-4">Unsupported widget type: {{ widget.type }}</div>

      <div
        v-if="hovering && locked"
        class="absolute text-xl text-white top-0 right-2"
      >
        <card class="m-2 px-2 rounded-full flex gap-2" secondary>
          <tpu-button variant="passive" icon :disabled="!widget?.props?.length">
            <RiEditLine style="width: 20px" />
          </tpu-button>
          <tpu-button variant="passive" icon no-ripple class="cursor-pointer">
            <RiDragMoveLine style="width: 20px" />
          </tpu-button>
        </card>
      </div>
    </tpu-hover>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType } from "vue";
import { HomeWidget, HomeWidgetType } from "@/gql/graphql";
import HomeWidgetAtAGlance from "@/components/Home/Widgets/HomeWidgetAtAGlance.vue";
import HomeWidgetSiteStats from "@/components/Home/Widgets/HomeWidgetSiteStats.vue";
import TpuHover from "@/components/Framework/Hover/TpuHover.vue";
import Card from "@/components/Framework/Card/Card.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiEditLine from "vue-remix-icons/icons/ri-edit-line.vue";
import RiDragMoveLine from "vue-remix-icons/icons/ri-drag-move-line.vue";
import HomeWidgetAnnouncements from "@/components/Home/Widgets/HomeWidgetAnnouncements.vue";
import HomeWidgetSiteGraph from "@/components/Home/Widgets/HomeWidgetSiteGraph.vue";

defineProps({
  widget: {
    type: Object as PropType<HomeWidget>,
    required: true
  }
});

const locked = inject("locked", { default: false });
</script>

<style scoped></style>
