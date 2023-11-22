<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Services</v-toolbar-title>
      </v-toolbar>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="service in services"
          :key="service.functions"
          :title="service.name"
        >
          <template v-slot:text>
            <v-card v-for="fun in service.functions" :key="fun.params">
              {{ fun.name }}:
              {{
                fun.params
                  .map((param: any) => param.name)
                  .join(",")
                  .replace(/,/g, "," + "")
              }}
            </v-card>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      services: [] as { name: string; functions: any[] }[]
    };
  },
  methods: {
    async getServices() {
      const { data } = await this.axios.get("/admin/services");
      // sort by ones that contain Service in the name
      this.services = data.filter((service: any) =>
        service.name.includes("Service")
      );
    }
  },
  mounted() {
    this.getServices();
  }
});
</script>
