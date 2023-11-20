<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Share Collection</template>
    <v-card-text>
      <v-select
        v-model="sharing.public"
        :items="sharing.publicOptions"
        :loading="sharing.loading"
        item-title="name"
        item-value="value"
        label="Public Accessibility"
        @update:model-value="updateShare"
      ></v-select>
      <template v-if="collection.shareLink">
        This collection can be viewed publicly from
        <a :href="'/collections/' + collection.shareLink" target="_blank">
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
          />
        </v-col>
        <v-col>
          <v-select
            v-model="sharing.role"
            :items="sharing.roles"
            item-title="name"
            item-value="value"
            label="Role"
          ></v-select>
        </v-col>
        <v-col sm="2">
          <v-btn @click="addUser">Add</v-btn>
        </v-col>
      </v-row>
      <v-data-table :headers="sharing.headers" :items="collection.users">
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.user.username }}</td>
            <td>
              <v-checkbox :model-value="row.item.read" disabled></v-checkbox>
            </td>
            <td>
              <v-checkbox
                :model-value="row.item.write"
                :disabled="row.item.configure"
                @update:model-value="updateUser({ ...row.item, write: $event })"
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                :model-value="row.item.configure"
                :disabled="row.item.recipientId === $user.user?.id"
                @update:model-value="
                  updateUser({ ...row.item, configure: $event })
                "
              ></v-checkbox>
            </td>
            <td>
              <v-btn
                :disabled="row.item.userId === $user.user?.id"
                icon
                @click="deleteUser(row.item)"
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
      <v-btn color="blue darken-1" @click="$emit('update:modelValue', false)">
        OK
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";

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
            key: "username"
          },
          {
            title: "Read",
            key: "read"
          },
          {
            title: "Write",
            key: "write"
          },
          {
            title: "Configure",
            key: "configure"
          },
          {
            title: "Actions",
            key: "actions"
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
      await this.$apollo.mutate({
        mutation: UpdateCollectionMutation,
        variables: {
          input: {
            collectionId: this.collection.id,
            shareLink: this.sharing.public === "link"
          }
        }
      });
      this.sharing.loading = false;
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
