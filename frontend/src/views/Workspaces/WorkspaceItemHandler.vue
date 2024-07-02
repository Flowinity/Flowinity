<template>
  <WorkspaceItem v-if="!$experiments.experiments.EDITOR_V2" />
  <div v-else>Please update your Flowinity version to use the new Editor.</div>
</template>

<script lang="ts" setup>
import WorkspaceItem from "@/views/Workspaces/WorkspaceItem.vue";
</script>
