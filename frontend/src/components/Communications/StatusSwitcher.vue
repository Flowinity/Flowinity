<template>
  <v-menu
    v-model="$chat.dialogs.statusMenu.value"
    location="top"
    offset="8"
    style="z-index: 2001"
  >
    <v-card>
      <v-list>
        <v-list-item @click="$user.changeStatus('online')">
          <template v-slot:prepend>
            <UserAvatar
              class="mr-3"
              size="36"
              :status="true"
              :user="$user.user"
              emulated-status="online"
              :dot-status="true"
              :status-x-offset="1"
            />
          </template>
          <v-list-item-title>Online</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$user.changeStatus('busy')">
          <template v-slot:prepend>
            <UserAvatar
              class="mr-3"
              size="36"
              :status="true"
              :user="$user.user"
              emulated-status="busy"
              :dot-status="true"
              :status-x-offset="1"
            />
          </template>
          <v-list-item-title>Do not disturb</v-list-item-title>
          <v-list-item-subtitle>
            You will not receive notifications.
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="$user.changeStatus('idle')">
          <template v-slot:prepend>
            <UserAvatar
              class="mr-3"
              size="36"
              :status="true"
              :user="$user.user"
              emulated-status="idle"
              :dot-status="true"
              :status-x-offset="1"
            />
          </template>
          <v-list-item-title>Idle</v-list-item-title>
          <v-list-item-subtitle>Appear as idle.</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="$user.changeStatus('invisible')">
          <template v-slot:prepend>
            <UserAvatar
              class="mr-3"
              size="36"
              :status="true"
              :user="$user.user"
              emulated-status="offline"
              :dot-status="true"
              :status-x-offset="1"
            />
          </template>
          <v-list-item-title>Invisible</v-list-item-title>
          <v-list-item-subtitle>
            Appear offline, read receipts, and the typing indicator will be
            disabled.
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
    <template v-slot:activator="{ props }">
      <v-card
        height="70"
        :rounded="false"
        flat
        class="elevation-0 d-flex ml-3 no-border border-top"
        id="status-switcher"
        color="dark"
      >
        <v-row class="d-flex align-center">
          <v-col cols="1" class="d-flex align-center">
            <UserAvatar
              :user="$user.user"
              size="40"
              :status="true"
              :status-x-offset="1"
              v-bind="props"
              class="ml-1 pointer"
              :dot-status="true"
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

export default defineComponent({
  name: "StatusSwitcher",
  components: { UserAvatar },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.$chat.dialogs.statusMenu.y}px;
        left: ${this.$chat.dialogs.statusMenu.x}px;`;
    }
  }
});
</script>

<style scoped></style>
