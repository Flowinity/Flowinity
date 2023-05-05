<template>
  <v-container>
    <CoreDialog max-width="600" v-model="dialog.value">
      <template v-slot:title>Edit badge</template>
      <v-col>
        <v-text-field label="Name" v-model="dialog.item.name"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Tooltip"
          v-model="dialog.item.tooltip"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Color" v-model="dialog.item.color"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Description"
          v-model="dialog.item.description"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Icon" v-model="dialog.item.icon"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Image" v-model="dialog.item.image"></v-text-field>
      </v-col>
      <v-col>
        <v-checkbox
          label="Unlocked"
          v-model="dialog.item.unlocked"
        ></v-checkbox>
      </v-col>
      <v-col>
        <v-text-field
          type="number"
          label="Plan ID"
          v-model="dialog.item.planId"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          type="number"
          label="Priority"
          v-model="dialog.item.priority"
        ></v-text-field>
      </v-col>
      <v-btn @click="updateItem">Update</v-btn>
    </CoreDialog>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Badges</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title>Add badges to user</v-card-title>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="selectedBadge"
              :items="badges"
              label="Badges"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="selectedUser"
              :items="users"
              label="Users"
              item-title="username"
              item-value="id"
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-btn @click="addBadges">Add badges</v-btn>
        <v-btn @click="removeBadges" class="ml-2">Remove badges</v-btn>
        <v-card-title>Create badge</v-card-title>
        <v-row>
          <v-col>
            <v-text-field label="Name" v-model="create.name"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Tooltip"
              v-model="create.tooltip"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Color" v-model="create.color"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Description"
              v-model="create.description"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Icon" v-model="create.icon"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Image" v-model="create.image"></v-text-field>
          </v-col>
          <v-col>
            <v-checkbox label="Unlocked" v-model="create.unlocked"></v-checkbox>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              label="Plan ID"
              v-model="create.planId"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              label="Prority"
              v-model="create.priority"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn @click="createBadge">Create badge</v-btn>
      </v-container>
      <v-data-table :headers="headers" :items="badges" :items-per-page="-1">
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="
              dialog.value = true;
              dialog.item = item.props.title;
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteItem(item.props.title.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "Badges",
  components: { CoreDialog },
  data() {
    return {
      dialog: {
        value: false,
        item: null as any
      },
      badges: [],
      users: [],
      selectedBadge: undefined as number | undefined,
      selectedUser: [] as number[],
      headers: [
        { title: "ID", key: "id" },
        { title: "Name", key: "name" },
        { title: "Tooltip", key: "tooltip" },
        { title: "Color", key: "color" },
        { title: "Description", key: "description" },
        { title: "Icon", key: "icon" },
        { title: "Image", key: "image" },
        { title: "Unlocked", key: "unlocked" },
        { title: "Plan ID", key: "planId" },
        {
          title: "Users count",
          key: "users.length"
        },
        {
          title: "Actions",
          key: "actions",
          sortable: false
        }
      ],
      create: {
        name: "",
        tooltip: "",
        color: "",
        description: "",
        icon: "",
        image: "",
        unlocked: false,
        planId: null,
        priority: 0
      }
    };
  },
  methods: {
    async removeBadges() {
      await this.axios.post("/admin/badge/users/delete", {
        id: this.selectedBadge,
        userIds: this.selectedUser
      });
      await this.getBadges();
    },
    async deleteItem(id: number) {
      await this.axios.delete(`/admin/badge/${id}`);
      await this.getBadges();
      this.$toast.success("yes");
    },
    async updateItem() {
      await this.axios.put("/admin/badge", this.dialog.item);
      await this.getBadges();
      this.dialog.value = false;
      this.$toast.success("yes");
    },
    async getBadges() {
      const { data } = await this.axios.get("/admin/badges");
      this.badges = data;
    },
    async getUsers() {
      const { data } = await this.axios.get("/admin/users");
      this.users = data;
    },
    async addBadges() {
      await this.axios.post("/admin/badge/users", {
        id: this.selectedBadge,
        userIds: this.selectedUser
      });
      await this.getBadges();
      this.$toast.success("yes");
      this.selectedBadge = undefined;
      this.selectedUser = [];
    },
    async createBadge() {
      await this.axios.post("/admin/badge", this.create);
      await this.getBadges();
      this.$toast.success("yes");
      this.create = {
        name: "",
        tooltip: "",
        color: "",
        description: "",
        icon: "",
        image: "",
        unlocked: false,
        planId: null,
        priority: 0
      };
    }
  },
  mounted() {
    this.getUsers();
    this.getBadges();
  }
});
</script>

<style scoped></style>
