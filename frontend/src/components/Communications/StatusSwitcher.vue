<template>
  <v-menu
    v-model="$chat.dialogs.statusMenu.value"
    location="top"
    offset="8"
    style="z-index: 2001"
  >
    <v-card>
      <StatusSwitcherList />
    </v-card>
    <template #activator="{ props }">
      <v-card
        id="status-switcher"
        :rounded="false"
        class="elevation-0 d-flex ml-3 no-border border-top"
        color="dark"
        flat
        height="70"
      >
        <v-row class="d-flex align-center">
          <v-col class="d-flex align-center" cols="1">
            <UserAvatar
              :dot-status="true"
              :status="true"
              :status-x-offset="1"
              :user="$user.user"
              class="ml-1 pointer"
              size="40"
              v-bind="props"
            />
            <v-card-text style="font-size: 16px">
              {{ $user.user?.username }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { UserStatus, UserStoredStatus } from "@/gql/graphql";
import StatusSwitcherList from "@/components/Communications/StatusSwitcherList.vue";

export default defineComponent({
  components: { StatusSwitcherList, UserAvatar },
  computed: {
    UserStoredStatus() {
      return UserStoredStatus;
    },
    UserStatus() {
      return UserStatus;
    },
    menuStyle() {
      return `
        position: absolute;
        top: ${this.$chat.dialogs.statusMenu.y}px;
        left: ${this.$chat.dialogs.statusMenu.x}px;`;
    }
  }
});
</script>
