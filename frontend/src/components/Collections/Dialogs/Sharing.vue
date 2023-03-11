<template>
  <CoreDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
  >
    <template v-slot:title>Share Collection</template>
    <v-card-text>
      <v-select
        label="Public Accessibility"
        v-model="sharing.public"
        :items="sharing.publicOptions"
        :loading="sharing.loading"
        item-title="name"
        item-value="value"
        @update:model-value="updateShare"
      ></v-select>
      <template v-if="collection.shareLink">
        This collection can be viewed publicly from
        <a target="_blank" :href="'/collections/' + collection.shareLink">
          {{ $app.site.hostnameWithProtocol }}/collections/{{
            collection.shareLink
          }}
        </a>
      </template>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            v-model="sharing.username"
            label="Username"
            @keydown.enter="addUser"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            v-model="sharing.role"
            :items="sharing.roles"
            label="Role"
            item-title="name"
            item-value="value"
          ></v-select>
        </v-col>
        <v-col sm="2"><v-btn @click="addUser" text>Add</v-btn></v-col>
      </v-row>
      <v-data-table :headers="sharing.headers" :items="collection.users">
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.props.title.user.username }}</td>
            <td>
              <v-checkbox
                label="Read"
                v-model="row.item.props.title.read"
                disabled
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                label="Write"
                @change="updateUser(row.item.props.title)"
                v-model="row.item.props.title.write"
                :disabled="row.item.props.title.configure"
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                label="Conf."
                @change="updateUser(row.item.props.title)"
                v-model="row.item.props.title.configure"
                :disabled="row.item.props.title.recipientId === $user.user?.id"
              ></v-checkbox>
            </td>
            <td>
              <v-btn
                icon
                @click="deleteUser(row.item.props.title)"
                text
                :disabled="row.item.props.title.userId === $user.user?.id"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>No data</template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="$emit('update:modelValue', false)"
      >
        OK
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "Sharing",
  components: { CoreDialog },
  props: ["modelValue", "collection"],
  emits: ["update:modelValue", "collectionUsersPush", "getCollection"],
  data() {
    return {
      sharing: {
        dialog: false,
        headers: [
          {
            title: "Username",
            value: "username"
          },
          {
            title: "Read",
            value: "read"
          },
          {
            title: "Write",
            value: "write"
          },
          {
            title: "Configure",
            value: "configure"
          },
          {
            title: "Actions",
            value: "actions"
          }
        ],
        roles: [
          {
            name: "Configure (rwc)",
            value: "rwc"
          },
          {
            name: "Write (rw)",
            value: "rw"
          },
          {
            name: "Read (r)",
            value: "ro"
          }
        ],
        role: "ro",
        username: "",
        users: [],
        public: "nobody",
        publicOptions: [
          {
            name: "Nobody",
            value: "nobody"
          },
          {
            name: "Anyone with the link",
            value: "link"
          }
        ],
        loading: false
      }
    };
  },
  methods: {
    async addUser() {
      const { data } = await this.axios.post(
        `/collections/${this.collection.id}/user`,
        {
          username: this.sharing.username,
          read: true,
          write: this.sharing.role === "rw" || this.sharing.role === "rwc",
          configure: this.sharing.role === "rwc"
        }
      );
      this.$emit("collectionUsersPush", data);
      this.sharing.username = "";
      this.sharing.role = "ro";
    },
    async updateShare() {
      this.sharing.loading = true;
      const { data } = await this.axios.patch(`/collections/share`, {
        id: this.collection.id,
        type: this.sharing.public
      });
      this.sharing.loading = false;
      this.collection.shareLink = data.shareLink;
    },
    async updateUser(item: any) {
      if (item.configure && !item.write) {
        item.write = true;
      }
      await this.axios.patch(`/collections/${this.collection.id}/user`, {
        id: item.recipientId,
        read: item.read,
        write: item.write,
        configure: item.configure
      });
    },
    async deleteUser(item: any) {
      await this.axios.delete(
        `/collections/${this.collection.id}/user/${item.recipientId}`
      );
      this.$toast.success("User removed successfully.");
      this.$emit("getCollection");
    }
  },
  mounted() {
    this.sharing.public = this.collection.shareLink ? "link" : "nobody";
  }
});
</script>

<style scoped></style>
