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
    <ColubrinaSidebarList></ColubrinaSidebarList>
    <template v-slot:append>
      <StatusSwitcher></StatusSwitcher>
    </template>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColubrinaSidebarList from "@/layouts/colubrina/SidebarList.vue";
import StatusSwitcher from "@/components/Communications/StatusSwitcher.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "ColubrinaSidebar",
  components: { CoreSidebar, StatusSwitcher, ColubrinaSidebarList },
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

<style scoped></style>
