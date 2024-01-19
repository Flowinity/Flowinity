<template>
  <v-container>
    <v-data-table :items="invites" :headers="headers">
      <template #[`item.createdAt`]="{ item }: any">
        {{ $date(item.createdAt).format("MMMM Do YYYY, h:mm:ss A") }}
      </template>
      <template #[`item.actions`]="{ item }: any">
        <v-btn
          v-if="item.status === 'pending'"
          icon
          small
          @click="actInvite('accepted', item)"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn
          v-if="item.status === 'pending'"
          icon
          small
          class="ml-5"
          @click="actInvite('rejected', item)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Invite } from "@/models/invite";

export default defineComponent({
  name: "IAF",
  data() {
    return {
      invites: [],
      loading: false,
      headers: [
        {
          title: "Invited Email",
          key: "email"
        },
        {
          title: "Invited by",
          key: "user.username"
        },
        {
          title: "Claimed by",
          key: "invited.username"
        },
        {
          title: "Created At",
          key: "createdAt"
        },
        {
          title: "Status",
          key: "status"
        },
        {
          title: "Actions",
          key: "actions"
        }
      ]
    };
  },
  mounted() {
    this.getInvites();
  },
  methods: {
    async actInvite(type: "accepted" | "rejected", item: Invite) {
      this.loading = true;
      await this.axios.patch(`/admin/invites/${item.inviteKey}`, {
        type
      });
      this.$toast.success("Invitation updated.");
    },
    async getInvites() {
      this.loading = true;
      const { data } = await this.axios.get("/admin/invites");
      this.invites = data.sort((a: Invite, b: Invite) => {
        return b.id - a.id;
      });
    }
  }
});
</script>
