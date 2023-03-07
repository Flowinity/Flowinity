<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>AutoCollects</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-select
          v-model="selected"
          item-title="username"
          item-key="id"
          :items="users"
          label="Users"
          return-object
        ></v-select>
        <v-select
          v-model="selectedRule"
          item-title="name"
          v-if="selected"
          item-key="id"
          :items="selected.autoCollectRules"
          label="Rule"
          return-object
        ></v-select>
        <v-btn color="red" @click="runGallery">
          Run entire gallery through AutoCollect Rule (may take up to 24h)
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User } from "@/models/user";
import { AutoCollectRule } from "@/models/autoCollectRule";

export default defineComponent({
  name: "Users",
  data() {
    return {
      users: [],
      selected: null as User | null,
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

<style scoped></style>
