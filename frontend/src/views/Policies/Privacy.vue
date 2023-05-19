<template>
  <WorkspaceItem :id="$app.site.privacyNoteId"></WorkspaceItem>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspaceItem from "@/views/Workspaces/Item.vue";

export default defineComponent({
  name: "PrivacyPolicy",
  components: { WorkspaceItem },
  mounted() {
    this.$app.title = "Privacy Policy";
  }
});
</script>

<style scoped></style>
