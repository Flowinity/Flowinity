<template>
  <v-list>
    <template v-if="friends?.length">
      <v-list-item v-for="friend in friends" :key="friend.id">
        <template #prepend>
          <UserAvatar
            :user="$user.users[friend.user.id]"
            :status="true"
            :dot-status="true"
            class="mr-4 cursor-pointer"
            @click="
              $router.push({
                name: 'User',
                params: { username: friend.user.username }
              })
            "
          />
        </template>
        <v-list-item-title>
          {{ $friends.getName(friend.user) }}
          <small
            class="text-grey"
            v-if="$friends.getName(friend.user) !== friend.user.username"
          >
            ({{ friend.user.username }})
          </small>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{
            $t("chats.settings.users.addUser.friendsSince", {
              date: $date(friend.createdAt).format("MMMM Do, YYYY")
            })
          }}
        </v-list-item-subtitle>
        <template #append>
          <v-btn
            v-if="
              friend.status === FriendStatus.Accepted ||
              friend.status === FriendStatus.Outgoing
            "
            color="error"
            icon
            @click="
              () => $friends.actOnFriend(friend.friendId, FriendAction.Remove)
            "
          >
            <v-tooltip activator="parent" location="top">
              <template v-if="friend.status === FriendStatus.Accepted">
                {{
                  $t("chats.socialHub.friends.removeFriend", {
                    username: friend.user.username
                  })
                }}
              </template>
              <template v-else>
                {{
                  $t("chats.socialHub.friends.cancelRequest", {
                    username: friend.user.username
                  })
                }}
              </template>
            </v-tooltip>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn
            v-if="friend.status === FriendStatus.Incoming"
            color="success"
            icon
            @click="
              () => $friends.actOnFriend(friend.friendId, FriendAction.Accept)
            "
          >
            <v-tooltip activator="parent" location="top">
              {{
                $t("chats.socialHub.friends.acceptRequest", {
                  username: friend.user.username
                })
              }}
            </v-tooltip>
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
    <v-list-item v-else>
      <v-list-item-title>
        {{ $t("chats.socialHub.friends.noFriends") }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { Friend, FriendAction, FriendStatus } from "@/gql/graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useApolloClient } from "@vue/apollo-composable";

const apolloClient = useApolloClient();
const props = defineProps({
  friends: {
    type: Array as () => Friend[],
    required: true
  }
});
</script>

<style scoped></style>
