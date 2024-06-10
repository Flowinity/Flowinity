<template>
  <WorkspaceItem v-if="!$experiments.experiments.EDITOR_V2" />
  <WorkspaceItemV2 v-else-if="isDev" />
  <div v-else>Please update your Flowinity version to use the new Editor.</div>
</template>

<script lang="ts" setup>
import WorkspaceItem from "@/views/Workspaces/WorkspaceItem.vue";
import WorkspaceItemV2 from "@/views/Workspaces/WorkspaceItemV2.vue";

const isDev = import.meta.env.DEV;
</script>
