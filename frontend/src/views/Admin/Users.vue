<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Users</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-data-table :headers="headers" :items="users">
          <template
            v-slot:item.banned="{
              item
            }: {
              item: {
                props: {
                  title: any
                }
              }
            }"
          >
            <v-checkbox
              :model-value="<boolean>item.props.title.banned"
              @change="ban(<number>item.props.title.id, $event.target.checked)"
            ></v-checkbox>
          </template>
          <template
            v-slot:item.administrator="{
              item
            }: {
              item: {
                props: {
                  title: any
                }
              }
            }"
          >
            <v-checkbox
              :model-value="item.props.title.administrator"
              disabled
            ></v-checkbox>
          </template>
          <template
            v-slot:item.planId="{
              item
            }: {
              item: {
                props: {
                  title: any
                }
              }
            }"
          >
            <v-checkbox
              :model-value="<number>item.props.title.planId === 6"
              @change="
                gold(
                  <number>item.props.title.id,
                  $event.target.checked,
                  <string>item.props.title.createdAt
                )
              "
            ></v-checkbox>
          </template>
          <template
            v-slot:item.createdAt="{
              item
            }: {
              item: {
                props: {
                  title: any
                }
              }
            }"
          >
            {{
              $date(item.props.title.createdAt).format("YYYY/MM/DD hh:mm:ss A")
            }}
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
    }
  },
  mounted() {
    this.getUsers();
  }
});
</script>

<style scoped></style>
