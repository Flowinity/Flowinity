<template>
  <CoreSidebar
    v-if="!$vuetify.display.mobile"
    v-model="$app.themeEditor"
    name="theme"
    :width="editor ? 450 : 256"
    class="unselectable"
    color="dark"
    floating
    location="right"
    permanent
  >
    <ThemeEngineSidebar @editor="editor = $event" />
  </CoreSidebar>
  <CoreDialog v-if="$vuetify.display.mobile" v-model="$app.themeEditor">
    <template #toolbar>
      <div></div>
    </template>
    <ThemeEngineSidebar @editor="editor = $event" />
  </CoreDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ThemeEngineSidebar from "@/components/Core/ThemeEngineSidebar.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

const editor = ref(false);
</script>
