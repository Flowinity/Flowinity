<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Users</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-data-table :headers="headers" :items="users">
          <template #[`item.banned`]="{ item }: any">
            <v-checkbox
              :model-value="item.banned"
              @change="ban(item.id, $event.target.checked)"
            />
          </template>
          <template #[`item.administrator`]="{ item }: any">
            <v-checkbox :model-value="item.administrator" :disabled="true" />
          </template>
          <template #[`item.planId`]="{ item }: any">
            <v-checkbox
              :model-value="item.planId === 6"
              @change="gold(item.id, $event.target.checked, item.createdAt)"
            />
          </template>
          <template #[`item.createdAt`]="{ item }: any">
            {{ $date(item.createdAt).format("YYYY/MM/DD hh:mm:ss A") }}
          </template>
          <template #[`item.emailVerified`]="{ item }: any">
            <v-checkbox
              v-model="item.emailVerified"
              @change="verify(item.id, $event.target.checked)"
            />
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      users: [],
      headers: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "Username",
          key: "username"
        },
        {
          title: "Email",
          key: "email"
        },
        {
          title: "Banned",
          key: "banned"
        },
        {
          title: "High level",
          key: "administrator"
        },
        {
          title: "Gold",
          key: "planId"
        },
        {
          title: "Email Verified",
          key: "emailVerified"
        },
        {
          title: "Created",
          key: "createdAt"
        }
      ]
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async gold(id: number, gold: boolean, createdAt: string) {
      const legacyUser =
        new Date(createdAt).getTime() < new Date("2023-02-20").getTime();
      await this.axios.patch("/admin/gold", {
        id,
        // todo: rewrite for TPU open source
        planId: this.$app.site.officialInstance
          ? gold
            ? 6
            : legacyUser
              ? 1
              : 7
          : 1
      });
      this.$toast.success("User gold status updated.");
    },
    async ban(id: number, banned: boolean) {
      await this.axios.patch("/admin/ban", { id, banned });
      this.$toast.success("User banned.");
    },
    async getUsers() {
      const { data } = await this.axios.get("/admin/users");
      this.users = data;
    },
    async verify(id: number, emailVerified: boolean) {
      await this.axios.patch("/admin/verify", { id, emailVerified });
      this.$toast.success("User email verified status updated.");
    }
  }
});
</script>
