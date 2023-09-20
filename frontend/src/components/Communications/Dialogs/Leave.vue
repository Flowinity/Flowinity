<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>
      {{
        deleteGroup ? $t("chats.leave.delete.title") : $t("chats.leave.title")
      }}
    </template>
    <v-card-text>
      <v-card-text>
        {{
          deleteGroup
            ? $t("chats.leave.delete.description", { name: chat.name })
            : $t("chats.leave.description", { name: chat.name })
        }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="leave">
          {{
            deleteGroup
              ? $t("chats.leave.delete.action")
              : $t("chats.leave.action")
          }}
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { Chat } from "@/gql/graphql";

export default defineComponent({
  name: "Leave",
  components: { CoreDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    chat: {
      type: Object as () => Chat | undefined,
      required: true
    }
  },
  emits: ["update:modelValue"],
  computed: {
    deleteGroup() {
      return this.chat?.userId === this.$user.user?.id;
    }
  },
  methods: {
    async leave() {
      if (!this.chat) return;
      await this.axios.delete(
        `/chats/${this.chat.association?.id}/association`
      );
      this.$emit("update:modelValue", false);
      this.$toast.success("You have left the group.");
      if (parseInt(this.$route.params.chatId) === this.chat.association?.id) {
        this.$router.push("/communications/home");
      }
    }
  }
});
</script>

<style scoped></style>
