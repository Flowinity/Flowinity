<template>
  <v-tabs class="mb-4 mt-n3">
    <v-tab to="/settings/security">Home</v-tab>
    <v-tab to="/settings/security/audit">Pulse Log</v-tab>
  </v-tabs>
  <v-data-table
    :headers="headers"
    :items="audit"
    :items-per-page="50"
    :loading="loading"
  >
    <template #bottom>
      <div class="text-center pt-2">
        <Paginate
          v-model="pager.currentPage"
          :total-pages="pager.totalPages"
          :total-visible="5"
        />
      </div>
    </template>
  </v-data-table>
  Total: {{ pager.totalItems.toLocaleString() }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "Security",
  components: { Paginate },
  data() {
    return {
      audit: [] as any[],
      loading: true,
      pager: {
        totalPages: 1,
        itemsPerPage: 50,
        totalItems: 0,
        currentPage: 1
      },
      headers: [
        {
          title: "Action",
          key: "action"
        },
        {
          title: "Route",
          key: "route"
        },
        {
          title: "Time spent",
          key: "timeSpent"
        },
        {
          title: "Created At",
          key: "createdAt"
        },
        { title: "Device", key: "device" }
      ]
    };
  },
  watch: {
    "pager.currentPage"() {
      this.getEntries();
    }
  },
  mounted() {
    this.getEntries();
  },
  methods: {
    async getEntries() {
      this.loading = true;
      const { data } = await this.axios.get("/security/audit", {
        params: {
          page: this.pager.currentPage
        }
      });
      this.audit = data.entries;
      this.pager = data.pager;
      this.loading = false;
    }
  }
});
</script>
