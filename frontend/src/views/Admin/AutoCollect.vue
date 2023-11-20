<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>AutoCollects</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-select
          v-model="selected"
          :items="users"
          item-value="id"
          item-title="username"
          label="Users"
          return-object
        />
        <v-select
          v-if="selected"
          v-model="selectedRule"
          :items="selected.autoCollectRules"
          item-value="id"
          item-title="name"
          label="Rule"
          return-object
        />
        <v-btn color="red" @click="runGallery">
          Run entire gallery through AutoCollect Rule (may take up to 24h)
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AutoCollectRule } from "@/models/autoCollectRule";

export default defineComponent({
  name: "Users",
  data() {
    return {
      users: [],
      selected: null as any,
      selectedRule: null as AutoCollectRule | null
    };
  },
  methods: {
    async getRules() {
      const { data } = await this.axios.get("/admin/autoCollects");
      this.users = data;
    },
    async runGallery() {
      if (!this.selected || !this.selectedRule) return;
      console.log(this.selectedRule, this.selected);
      await this.axios.post("/admin/autoCollects", {
        userId: this.selected.id,
        ruleId: this.selectedRule.id
      });
    }
  },
  mounted() {
    this.getRules();
  }
});
</script>
