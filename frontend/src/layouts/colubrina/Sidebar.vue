<template>
  <v-navigation-drawer
    v-model="val"
    :class="{
      'sidebar-patch': $experiments.experiments.RAIL_SIDEBAR && $app.rail
    }"
    :floating="true"
    color="dark"
  >
    <ColubrinaSidebarList></ColubrinaSidebarList>
    <template v-slot:append>
      <StatusSwitcher></StatusSwitcher>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ColubrinaSidebarList from "@/layouts/colubrina/SidebarList.vue";
import StatusSwitcher from "@/components/Communications/StatusSwitcher.vue";

export default defineComponent({
  name: "ColubrinaSidebar",
  components: {StatusSwitcher, ColubrinaSidebarList},
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
