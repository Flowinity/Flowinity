<template>
  <WorkspaceItem
    id="e7b8dad4bb79ed02ddf431ecf73664e945c6254addd4fcd86ae09ef0dd427027"
  ></WorkspaceItem>
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
