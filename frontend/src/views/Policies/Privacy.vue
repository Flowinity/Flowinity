<template>
  <WorkspaceItem :id="$app.site.privacyNoteId" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspaceItem from "@/views/Workspaces/WorkspaceItem.vue";

export default defineComponent({
  name: "PrivacyPolicy",
  components: { WorkspaceItem },
  mounted() {
    this.$app.title = "Privacy Policy";
  }
});
</script>
