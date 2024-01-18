<template>
  <WorkspaceItem
    :id="
      $app.site.privacyNoteId ||
      'e7b8dad4bb79ed02ddf431ecf73664e945c6254addd4fcd86ae09ef0dd427027'
    "
  />
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
