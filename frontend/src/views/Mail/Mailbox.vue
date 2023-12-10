<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  watch: {
    $route() {
      this.$app.title = `${this.$functions.charUp(this.$mail.selectedMailbox)}`;
    }
  },
  mounted() {
    this.$app.title = `${this.$functions.charUp(this.$mail.selectedMailbox)}`;
  }
});
</script>
