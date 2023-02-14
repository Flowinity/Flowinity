<template>
  <WorkspaceItem
    id="d8c4711bf14338338dd331e0b2a4823f2c6ca3bbb4e02a76b9d30f591e2b8635"
  >
  </WorkspaceItem>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspaceItem from "@/views/Workspaces/Item.vue";

export default defineComponent({
  name: "ContentPolicies",
  components: { WorkspaceItem },
  mounted() {
    this.$app.title = "Content Policies";
  }
});
</script>

<style scoped></style>
