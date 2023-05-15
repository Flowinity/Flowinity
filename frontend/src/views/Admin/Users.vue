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
              :model-value="item.props.title.banned"
              @change="ban(item.props.title.id, $event.target.checked)"
            ></v-checkbox>
          </template>
          <template v-slot:item.administrator="{ item }">
            <v-checkbox
              :model-value="item.props.title.administrator"
              disabled
            ></v-checkbox>
          </template>
          <template v-slot:item.planId="{ item }">
            <v-checkbox
              :model-value="item.props.title.planId === 6"
              @change="
                gold(
                  item.props.title.id,
                  $event.target.checked,
                  item.props.title.createdAt
                )
              "
            ></v-checkbox>
          </template>
          <template v-slot:item.createdAt="{ item }">
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
import {defineComponent} from "vue"

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
    }
  },
  methods: {
    async gold(id: number, gold: boolean, createdAt: string) {
      const legacyUser =
        new Date(createdAt).getTime() < new Date("2023-02-20").getTime()
      await this.axios.patch("/admin/gold", {
        id,
        planId: gold ? 6 : legacyUser ? 1 : 7
      })
      this.$toast.success("User gold status updated.")
    },
    async ban(id: number, banned: boolean) {
      await this.axios.patch("/admin/ban", {id, banned})
      this.$toast.success("User banned.")
    },
    async getUsers() {
      const {data} = await this.axios.get("/admin/users")
      this.users = data
    }
  },
  mounted() {
    this.getUsers()
  }
})
</script>

<style scoped></style>
