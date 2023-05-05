<template>
  <v-card class="mt-4">
    <v-toolbar>
      <v-toolbar-title>Linking account... please wait...</v-toolbar-title>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "IntegrationsLink",
  components: { HoverChip },
  methods: {
    async link() {
      await this.axios.get(`/providers/link/${this.$route.params.provider}`, {
        params: {
          token: this.$route.query.token || this.$route.query.code
        }
      });
      this.$toast.success("Account linked!");
      this.$router.push("/settings/integrations");
    }
  },
  mounted() {
    this.link();
  }
});
</script>

<style scoped></style>
