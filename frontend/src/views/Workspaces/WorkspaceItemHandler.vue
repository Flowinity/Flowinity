<template>
  <WorkspaceItem v-if="!$experiments.experiments.EDITOR_V2" />
  <WorkspaceItemV2 v-else />
</template>

<script setup lang="ts">
import WorkspaceItem from "@/views/Workspaces/WorkspaceItem.vue";
import WorkspaceItemV2 from "@/views/Workspaces/WorkspaceItemV2.vue";
</script>
