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
    <template v-if="del.step === 0">
      <v-container>
        <v-card-text>
          {{
            deleteGroup
              ? $t("chats.leave.delete.description", { name: chat.name })
              : $t("chats.leave.description", { name: chat.name })
          }}
        </v-card-text>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="deleteGroup ? (del.step = 1) : leave">
          {{ deleteGroup ? $t("generic.next") : $t("chats.leave.action") }}
        </v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-text>
        <v-text-field
          v-if="$user.user.totpEnable && !del.passwordMode"
          :label="$t('settings.home.totp.code')"
          v-model="del.totp"
          @keydown.enter="doDelete"
        >
          <template v-slot:details>
            Having problems?
            <a class="unselectable pointer" @click="del.passwordMode = true">
              &nbsp;Use your password instead.
            </a>
          </template>
        </v-text-field>
        <v-text-field
          v-else
          v-model="del.password"
          type="password"
          @keydown.enter="doDelete"
          :label="$t('settings.home.myAccount.currentPassword')"
        >
          <template v-slot:details>
            Having problems?
            <a
              class="unselectable pointer"
              @click="del.passwordMode = false"
              v-if="$user.user.totpEnable"
            >
              &nbsp;Use your 2FA code instead.
            </a>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn color="red" @click="doDelete">Delete</v-btn>
      </v-card-actions>
    </template>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { Chat } from "@/gql/graphql";
import { DeleteGroupMutation } from "@/graphql/chats/deleteGroup.graphql";

export default defineComponent({
  name: "Leave",
  components: { CoreDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      del: {
        step: 0,
        password: "",
        totp: "",
        passwordMode: false
      }
    };
  },
  computed: {
    chat() {
      return this.$chat.chats.find(
        (chat) => chat.id === this.$chat.dialogs.leave.itemId
      );
    },
    deleteGroup() {
      return this.chat?.userId === this.$user.user?.id;
    }
  },
  methods: {
    async doDelete() {
      if (!this.chat) return;
      await this.$apollo.mutate({
        mutation: DeleteGroupMutation,
        variables: {
          input: {
            totp: this.del.passwordMode ? undefined : this.del.totp,
            password: this.del.passwordMode ? this.del.password : undefined,
            associationId: this.chat.association.id
          }
        }
      });
      this.$emit("update:modelValue", false);
    },
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
