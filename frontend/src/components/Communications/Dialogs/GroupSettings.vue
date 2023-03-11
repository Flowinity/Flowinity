<template>
  <CoreDialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="800px"
  >
    <UploadCropper v-model="groupIcon" @finish="uploadIcon" />
    <template v-slot:title>Group Settings</template>
    <template v-if="$chat.dialogs.groupSettings.item">
      <v-card-text>
        <v-card-title>Group Name</v-card-title>
        <v-text-field
          class="mx-4"
          v-model="$chat.dialogs.groupSettings.item.name"
        ></v-text-field>
        <v-card-actions class="mb-n5">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$chat.saveSettings">Save</v-btn>
        </v-card-actions>
        <v-card-title>Group Icon</v-card-title>
        <v-btn @click="groupIcon = true">Set group icon</v-btn>
        <v-btn @click="removeIcon">Remove group icon</v-btn>
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
                :disabled="member.rank === 'owner'"
                @update:model-value="changeRank(member.userId, member.rank)"
              ></v-select>
              <v-list-item-action>
                <v-btn
                  icon
                  @click="removeUser(member.userId)"
                  :disabled="member.rank === 'owner'"
                >
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
          <br />
          THE OWNER RANK CANNOT BE REMOVED FROM THE USER!
        </small>
      </v-card-text>
    </template>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "ColubrinaGroupSettingsDialog",
  components: { CoreDialog, UploadCropper, CreateChat, UserAvatar },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      icon: undefined as File[] | undefined,
      add: false,
      groupIcon: false,
      groupIconLoading: false
    };
  },
  computed: {
    ranks() {
      let ranks = [
        {
          text: "Owner",
          value: "owner",
          props: { disabled: true }
        },
        {
          text: "Admin",
          value: "admin",
          props: { disabled: false }
        },
        {
          text: "Member",
          value: "member",
          props: { disabled: false }
        }
      ];
      if (
        this.$chat.dialogs.groupSettings.item?.association?.rank === "owner"
      ) {
        ranks[0].props.disabled = false;
      }
      return ranks;
    }
  },
  methods: {
    async uploadIcon(file: File) {
      if (this.$chat.dialogs.groupSettings.item) {
        this.groupIconLoading = true;
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.dialogs.groupSettings.item.association?.id}/icon`,
          formData
        );
        this.groupIcon = false;
        this.groupIconLoading = false;
      }
    },
    async removeIcon() {
      if (this.$chat.dialogs.groupSettings.item) {
        await this.axios.delete(
          `/chats/${this.$chat.dialogs.groupSettings.item.association?.id}/icon`
        );
      }
    },
    async changeRank(id: number, rank: string) {
      await this.axios.put(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users/${id}`,
        {
          rank
        }
      );
    },
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
      await this.axios.post(
        `/chats/${this.$chat.dialogs.groupSettings.item?.association?.id}/users`,
        {
          users
        }
      );
    }
  }
});
</script>

<style scoped></style>
