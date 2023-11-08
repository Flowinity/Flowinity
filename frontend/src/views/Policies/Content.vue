<template>
  <WorkspaceItem :id="$app.site.termsNoteId"></WorkspaceItem>
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
