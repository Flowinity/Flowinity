<template>
  <CoreSidebar
    name="theme"
    v-if="!$vuetify.display.mobile"
    v-model="$app.themeEditor"
    :width="editor ? 450 : 256"
    class="unselectable"
    color="dark"
    floating
    location="right"
    permanent
  >
    <ThemeEngineSidebar @editor="editor = $event"></ThemeEngineSidebar>
  </CoreSidebar>
  <CoreDialog v-if="$vuetify.display.mobile" v-model="$app.themeEditor">
    <template v-slot:toolbar>
      <div></div>
    </template>
    <ThemeEngineSidebar @editor="editor = $event"></ThemeEngineSidebar>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeEngineSidebar from "@/components/Core/ThemeEngineSidebar.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "ThemeEngineWrapper",
  components: {
    CoreSidebar,
    CoreDialog,
    ThemeEngineSidebar
  },
  data() {
    return {
      editor: false
    };
  }
});
</script>

<style scoped></style>
