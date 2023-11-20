<template>
  <CoreSidebar
    name="chat"
    v-model="val"
    :class="{
      'sidebar-patch': $experiments.experiments.RAIL_SIDEBAR && $app.rail
    }"
    color="dark"
    :floating="true"
  >
    <p
      class="text-blue mt-4 ml-4 text-small pointer unselectable"
      v-if="$vuetify.display.mobile && $chat.isCommunications"
      @click="$app.railMode = 'tpu'"
    >
      <v-icon>mdi-arrow-left</v-icon>
      {{ $t("core.sidebar.backToTPU") }}
    </p>
    <SidebarList />
    <template v-slot:append>
      <StatusSwitcher />
    </template>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SidebarList from "@/layouts/communications/SidebarList.vue";
import StatusSwitcher from "@/components/Communications/StatusSwitcher.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  components: { CoreSidebar, StatusSwitcher, SidebarList },
  computed: {
    val: {
      get: function () {
        if (!this.$vuetify.display.mobile) return true;
        return this.$app.mainDrawer;
      },
      set: function (value: boolean) {
        if (!this.$vuetify.display.mobile) return;
        this.$app.mainDrawer = value;
      }
    }
  }
});
</script>
