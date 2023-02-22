<template>
  <v-dialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="800px"
    max-height="1200px"
  >
    <v-card v-if="$chat.dialogs.groupSettings.item">
      <v-toolbar>
        <v-toolbar-title>Group Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card-title>Group Name</v-card-title>
        <v-text-field
          class="mx-4"
          v-model="$chat.dialogs.groupSettings.item.name"
        ></v-text-field>
        <v-card-title>Group Icon</v-card-title>
        <v-file-input v-model="icon" label="Upload Group Icon"></v-file-input>
        <v-card-actions class="mb-n5">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$chat.saveSettings">Save</v-btn>
        </v-card-actions>
      </v-card-text>
      <v-card-text>
        <v-card-title>
          Group Members
          <CreateChat
            type="add"
            v-model="add"
            v-slot="{ props }"
            @add="addUsers($event)"
          >
            <v-btn
              size="xsmall"
              icon
              class="mr-2"
              @click="add = true"
              v-bind="props"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </CreateChat>
        </v-card-title>
        <v-list max-height="500">
          <v-list-item
            v-for="member in $chat.dialogs.groupSettings.item?.users"
            :key="member.id"
          >
            <template v-slot:prepend>
              <UserAvatar :user="member.user" />
            </template>
            <v-list-item-title class="ml-3">
              {{ member.user?.username || "Deleted User" }}
            </v-list-item-title>
            <template v-slot:append>
              <v-select
                v-model="member.rank"
                :items="ranks"
                outlined
                item-title="text"
                item-value="value"
              ></v-select>
              <v-list-item-action>
                <v-btn icon @click="removeUser(member.userId)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
        <small>
          * About roles: Admins have the same abilities as the owner except they
          cannot delete the group, or modify users with the owner rank, if a
          user is kicked or leaves, their rank will be reset to member.
        </small>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";

export default defineComponent({
  name: "ColubrinaGroupSettingsDialog",
  components: { CreateChat, UserAvatar },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      icon: null,
      add: false,
      ranks: [
        {
          text: "Owner",
          value: "owner"
        },
        {
          text: "Admin",
          value: "admin"
        },
        {
          text: "Member",
          value: "member"
        }
      ]
    };
  },
  methods: {
    async removeUser(id: number) {
      await this.axios.delete(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users/${id}`
      );
      if (this.$chat.dialogs.groupSettings.item)
        this.$chat.dialogs.groupSettings.item.users.splice(
          this.$chat.dialogs.groupSettings.item.users.findIndex(
            (user) => user.id === id
          ),
          1
        );
    },
    async addUsers(users: number[]) {
      const { data } = await this.axios.post(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users`,
        {
          users
        }
      );
      if (this.$chat.dialogs.groupSettings.item)
        this.$chat.dialogs.groupSettings.item.users = data;
    }
  }
});
</script>

<style scoped></style>
