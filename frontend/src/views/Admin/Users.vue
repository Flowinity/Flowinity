<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Users</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-data-table :headers="headers" :items="users">
          <template v-slot:item.banned="{ item }">
            <v-checkbox
              :model-value="<boolean>item.raw.banned"
              @change="ban(<number>item.raw.id, $event.target.checked)"
            ></v-checkbox>
          </template>
          <template v-slot:item.administrator="{ item }">
            <v-checkbox
              :model-value="item.raw.administrator"
              disabled
            ></v-checkbox>
          </template>
          <template v-slot:item.planId="{ item }">
            <v-checkbox
              :model-value="<number>item.raw.planId === 6"
              @change="
                gold(
                  <number>item.raw.id,
                  $event.target.checked,
                  <string>item.raw.createdAt
                )
              "
            ></v-checkbox>
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ $date(item.raw.createdAt).format("YYYY/MM/DD hh:mm:ss A") }}
          </template>
          <template v-slot:item.emailVerified="{ item }">
            <v-checkbox
              v-model="item.raw.emailVerified"
              @change="verify(item.raw.id, $event.target.checked)"
            ></v-checkbox>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Users",
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
  },
  mounted() {
    this.getUsers();
  }
});
</script>

<style scoped></style>
