<template>
  <v-dialog
    @update:modelValue="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    max-width="700px"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Leave Group</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card-text>
          Are you sure you want to leave this group? You will not be able to
          rejoin unless you are re-added by a member.
          <br />
          Chat:
          <strong>{{ chat.name }}</strong>
          <!-- find all users that are owners, if there is only one, then the user is the only owner -->
          <template
            v-if="
              chat.association.rank === 'owner' &&
              chat.users.filter((user) => user.rank === 'owner').length === 1
            "
          >
            <br />
            <strong style="color: #f44336">Warning:</strong>
            You are the only owner of this group. If you leave, a random member
            will be assigned as the new owner unless you give someone else
            ownership before leaving.
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="leave">Leave</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Leave",
  props: ["modelValue", "chat"],
  emits: ["update:modelValue"],
  methods: {
    async leave() {
      await this.axios.delete(
        `/chats/${this.chat.association?.id}/association`
      );
      this.$emit("update:modelValue", false);
      this.$toast.success("You have left the group.");
      if (this.$route.params.chatId === this.chat.association?.id) {
        this.$router.push("/communications/home");
      }
    }
  }
});
</script>

<style scoped></style>
