<template>
  <overline position="center">
    {{ $t("chats.settings.audit.name") }}
  </overline>
  <div>
    <v-list v-for="entry in log.items" v-if="log" :key="entry.id">
      <v-list-item>
        <template v-slot:prepend>
          <div class="position-relative mr-2">
            <v-icon>
              {{ icon(entry.category, entry.actionType).icon }}
            </v-icon>
            <v-icon
              style="
                position: absolute;
                bottom: 0;
                right: 1px;
                padding: 4px;
                border-radius: 100%;
                background: black;
                z-index: 2;
              "
              size="12"
              :color="icon(entry.category, entry.actionType).color"
            >
              {{ icon(entry.category, entry.actionType).smallIcon }}
            </v-icon>
          </div>
        </template>
        <template v-slot:title>
          <span
            v-memo="entry.message"
            v-html="$functions.markdown(entry.message, null)"
          ></span>
        </template>
        <template v-slot:subtitle>
          {{ $date(entry.createdAt).format("YYYY-MM-DD HH:mm:ss A") }}
        </template>
      </v-list-item>
    </v-list>
    <Paginate v-model="page" :total-pages="log?.pager.totalPages" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import {
  AuditLogActionType,
  AuditLogCategory,
  PaginatedChatAuditLogResponse
} from "@/gql/graphql";
import { AuditLogQuery } from "@/graphql/chats/auditLog.graphql";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "ChatSettingsAudit",
  components: { Paginate, UserAvatar, UploadCropper, Overline },
  props: ["active"],
  data() {
    return {
      log: null as PaginatedChatAuditLogResponse | null,
      page: 1
    };
  },
  methods: {
    icon(category: AuditLogCategory, action: AuditLogActionType) {
      const res = {
        icon: "",
        color: "",
        smallIcon: ""
      };
      switch (category) {
        case AuditLogCategory.Bot:
          res.icon = "mdi-robot";
          break;
        case AuditLogCategory.Emoji:
          res.icon = "mdi-emoticon";
          break;
        case AuditLogCategory.Invite:
          res.icon = "mdi-gift";
          break;
        case AuditLogCategory.Message:
          res.icon = "mdi-message";
          break;
        case AuditLogCategory.PinMessage:
          res.icon = "mdi-pin";
          break;
        case AuditLogCategory.Rank:
          res.icon = "mdi-lock";
          break;
        case AuditLogCategory.Settings:
          res.icon = "mdi-settings";
          break;
        case AuditLogCategory.User:
          res.icon = "mdi-account";
          break;
      }
      switch (action) {
        case AuditLogActionType.Add:
          res.color = "success";
          res.smallIcon = "mdi-plus";
          break;
        case AuditLogActionType.Modify:
          res.color = "warning";
          res.smallIcon = "mdi-refresh";
          break;
        case AuditLogActionType.Remove:
          res.color = "error";
          res.smallIcon = "mdi-close";
          break;
      }
      return res;
    },
    async getAudit() {
      const {
        data: { chatAuditLog }
      } = await this.$apollo.query({
        query: AuditLogQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {
            associationId: this.$chat.editingChat.association.id,
            page: this.page
          }
        }
      });
      this.log = chatAuditLog;
    }
  },
  mounted() {
    this.getAudit();
  },
  watch: {
    active(val) {
      if (!val) return;
      this.getAudit();
    }
  }
});
</script>

<style scoped></style>
