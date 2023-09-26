<template>
  <overline position="center">
    {{ $t("chats.settings.audit.name") }}
  </overline>
  <div>
    <v-list
      v-for="entry in log.items"
      v-if="log"
      :key="entry.id"
      max-width="600"
    >
      <v-list-item>
        <template v-slot:title>
          <span v-html="$functions.markdown(entry.message)"></span>
        </template>
        <template v-slot:subtitle>
          {{ $date(entry.createdAt).format("YYYY-MM-DD HH:mm:ss A") }}
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { ChatAuditLog, PaginatedAuditLogResponse } from "@/gql/graphql";
import { AuditLogQuery } from "@/graphql/chats/auditLog.graphql";

export default defineComponent({
  name: "ChatSettingsAudit",
  components: { UserAvatar, UploadCropper, Overline },
  data() {
    return {
      log: null as PaginatedAuditLogResponse | null
    };
  },
  methods: {
    async getAudit() {
      const {
        data: { chatAuditLog }
      } = await this.$apollo.query({
        query: AuditLogQuery,
        variables: {
          input: {
            associationId: this.$chat.editingChat.association.id
          }
        }
      });
      this.log = chatAuditLog;
    }
  },
  mounted() {
    this.getAudit();
  }
});
</script>

<style scoped></style>
