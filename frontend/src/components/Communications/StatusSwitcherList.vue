<template>
  <v-list>
    <v-list-item @click="$user.changeStatus(UserStoredStatus.Online)">
      <template #prepend>
        <UserAvatar
          :dot-status="true"
          :status="true"
          :status-x-offset="1"
          :user="$user.user"
          class="mr-3"
          :emulated-status="UserStatus.Online"
          size="36"
        />
      </template>
      <v-list-item-title>Online</v-list-item-title>
    </v-list-item>
    <v-list-item @click="$user.changeStatus(UserStoredStatus.Busy)">
      <template #prepend>
        <UserAvatar
          :dot-status="true"
          :status="true"
          :status-x-offset="1"
          :user="$user.user"
          class="mr-3"
          :emulated-status="UserStatus.Busy"
          size="36"
        />
      </template>
      <v-list-item-title>Do not disturb</v-list-item-title>
      <v-list-item-subtitle>
        You will not receive notifications.
      </v-list-item-subtitle>
    </v-list-item>
    <v-list-item @click="$user.changeStatus(UserStoredStatus.Idle)">
      <template #prepend>
        <UserAvatar
          :dot-status="true"
          :status="true"
          :status-x-offset="1"
          :user="$user.user"
          class="mr-3"
          :emulated-status="UserStatus.Idle"
          size="36"
        />
      </template>
      <v-list-item-title>Idle</v-list-item-title>
      <v-list-item-subtitle>Appear as idle.</v-list-item-subtitle>
    </v-list-item>
    <v-list-item @click="$user.changeStatus(UserStoredStatus.Invisible)">
      <template #prepend>
        <UserAvatar
          :dot-status="true"
          :status="true"
          :status-x-offset="1"
          :user="$user.user"
          class="mr-3"
          :emulated-status="UserStatus.Offline"
          size="36"
        />
      </template>
      <v-list-item-title>Invisible</v-list-item-title>
      <v-list-item-subtitle>
        Appear offline, read receipts, and the typing indicator will be
        disabled.
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { UserStatus, UserStoredStatus } from "@/gql/graphql";

export default defineComponent({
  name: "StatusSwitcherList",
  components: { UserAvatar },
  computed: {
    UserStoredStatus() {
      return UserStoredStatus;
    },
    UserStatus() {
      return UserStatus;
    }
  }
});
</script>
