<template>
  <v-list>
    <v-list-item v-for="friend in friends" :key="friend.id">
      <template #prepend>
        <UserAvatar
          :user="$user.users[friend.blockedUser.id]"
          :status="true"
          :dot-status="true"
          class="mr-4"
        />
      </template>
      <v-list-item-title>
        {{ friend.blockedUser.username }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{
          $t("chats.socialHub.friends.blockedSince", {
            date: $date(friend.createdAt).format("MMMM Do, YYYY")
          })
        }}
      </v-list-item-subtitle>
      <template #append>
        <v-btn
          color="error"
          icon
          @click="
            $user.dialogs.block.userId = friend.blockedUser.id;
            $user.blockUser();
          "
        >
          <v-tooltip activator="parent" location="top">
            {{
              $t("chats.socialHub.friends.unblock", {
                username: friend.blockedUser.username
              })
            }}
          </v-tooltip>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { BlockedUser, Friend, FriendAction, FriendStatus } from "@/gql/graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useApolloClient } from "@vue/apollo-composable";

const apolloClient = useApolloClient();
const props = defineProps({
  friends: {
    type: Array as () => BlockedUser[],
    required: true
  }
});
</script>

<style scoped></style>
