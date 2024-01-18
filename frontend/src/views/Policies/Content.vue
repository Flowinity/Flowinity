<template>
  <WorkspaceItem
    :id="
      $app.site.termsNoteId ||
      'd8c4711bf14338338dd331e0b2a4823f2c6ca3bbb4e02a76b9d30f591e2b8635'
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspaceItem from "@/views/Workspaces/WorkspaceItem.vue";

export default defineComponent({
  name: "ContentPolicies",
  components: { WorkspaceItem },
  mounted() {
    this.$app.title = "Content Policies";
  }
});
</script>
