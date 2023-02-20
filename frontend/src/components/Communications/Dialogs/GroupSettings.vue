<template>
  <v-dialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="800px"
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
          v-model="$chat.dialogs.groupSettings.item.name"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-card-title>
          Group Members
          <CreateChat type="add" v-model="add" v-slot="{ props }">
            <v-btn
              size="xsmall"
              icon
              class="mr-2"
              @click="add = true"
              v-bind="props"
              @add="addUsers($event)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </CreateChat>
        </v-card-title>
        <v-list>
          <v-list-item
            v-for="member in $chat.dialogs.groupSettings.item?.users"
            :key="member.id"
          >
            <template v-slot:prepend>
              <UserAvatar :user="member.user" />
            </template>
            <v-list-item-title class="ml-3">
              {{ member.user.username }}
            </v-list-item-title>
            <template v-slot:append>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
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
      add: false
    };
  },
  methods: {
    async addUsers(users: number[]) {
      const { data } = await this.axios.post(
        `/communications/${this.$chat.dialogs.groupSettings.item?.association?.id}/users`,
        {
          users
        }
      );
      this.$chat.dialogs.groupSettings.item?.users.push(...data);
      this.$chat.getChats();
    }
  }
});
</script>

<style scoped></style>
