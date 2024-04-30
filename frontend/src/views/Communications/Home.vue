<template>
  <v-tabs v-model="tab" background-color="transparent" grow>
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :prepend-icon="tab.icon"
      :value="index"
    >
      {{ tab.title }}
      <v-btn
        v-if="tab.badge"
        icon
        size="x-small"
        variant="outlined"
        class="ml-2"
        :ripple="false"
      >
        {{
          //@ts-ignore
          tab.badge()
        }}
      </v-btn>
    </v-tab>
  </v-tabs>
  <v-container>
    <v-text-field
      v-if="tab !== 0 && tab !== 5"
      v-model="search"
      label="Search"
      placeholder="Search for friends"
      outlined
      dense
      clearable
      hide-details
      class="mx-4 mb-4"
    />
    <template v-if="tab === 0">
      <div class="d-flex flex-wrap" style="gap: 12px">
        <DynamicCard
          v-for="chat in recentChats"
          :key="chat.id"
          :image="`${appStore.domain}${chat.recipient ? $user.users[chat.recipient.id]?.avatar || 'a050d6f271c3.png' : chat.background || chat.icon || 'a050d6f271c3.png'}`"
          :secondary-text="
            chat._redisSortDate
              ? `Last message was ${$date(
                  parseInt(chat._redisSortDate)
                ).fromNow()}`
              : chat.description
          "
          :right-text="chat._redisSortDate ? undefined : 'Promoted'"
          :title="$chat.chatName(chat)"
          :to="`/communications/${chat.association?.id}`"
          style="width: 350px; height: 200px"
          :normal-gradient="true"
        ></DynamicCard>
      </div>
    </template>
    <template v-else-if="tab === 1">
      <template v-if="currentFriendsOnline.length">
        <overline position="start">Online</overline>
        <FriendsList :friends="<Friend[]>searchWrapper" />
      </template>
      <overline position="start">Offline</overline>
      <FriendsList :friends="<Friend[]>searchWrapper" />
    </template>
    <template v-else-if="tab === 2">
      <FriendsList :friends="<Friend[]>searchWrapper" />
    </template>
    <template v-else-if="tab === 3">
      <FriendsList :friends="<Friend[]>searchWrapper" />
    </template>
    <template v-else-if="tab === 4">
      <BlockList :friends="<BlockedUser[]>searchWrapper" />
    </template>
    <template v-else-if="tab === 5">
      <div class="d-flex flex-column">
        <v-text-field
          v-model="addFriend.username"
          label="Username"
          @keydown.enter="sendFriendRequest()"
        />
        <v-btn
          :loading="addFriend.loading"
          :color="addFriend.success ? 'success' : 'primary'"
          class="mb-5 friend-button"
          variant="tonal"
          @click="sendFriendRequest()"
        >
          <v-icon class="mr-1">
            {{ addFriend.success ? "mdi-check" : "mdi-account-plus" }}
          </v-icon>
          {{
            addFriend.success
              ? $t("chats.socialHub.friends.friendRequestSuccess")
              : $t("chats.socialHub.friends.addFriend")
          }}
        </v-btn>
      </div>
      <div>
        <v-divider></v-divider>
        <div class="d-flex justify-center align-center">
          <v-icon size="96">mdi-account-multiple-plus</v-icon>
          <div class="ml-2" style="max-width: 400px">
            <v-card-title
              class="text-h6"
              style="white-space: pre-wrap; overflow-wrap: anywhere"
            >
              {{ $t("chats.socialHub.friends.addFriendTitle") }}
            </v-card-title>
            <v-card-subtitle
              style="white-space: pre-wrap; overflow-wrap: anywhere"
            >
              {{ $t("chats.socialHub.friends.addFriendDesc") }}
            </v-card-subtitle>
          </div>
        </div>
      </div>
    </template>
  </v-container>
  <v-container class="text-center justify-center" v-if="false">
    <PromoNoContent
      :description="`Chat with other ${$app.site.name} users instantly.`"
      icon="mdi-message-processing-outline"
      :title="`${$app.site.name} Communications`"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import { useChatStore } from "@/store/chat.store";
import {
  BlockedUser,
  Chat,
  Friend,
  FriendAction,
  FriendStatus,
  UserStatus
} from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { ChatInviteQuery } from "@/graphql/chats/invite.graphql";
import DynamicCard from "@/components/Core/DynamicCard.vue";
import FriendsList from "@/components/Communications/SocialHub/FriendsList.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import BlockList from "@/components/Communications/SocialHub/BlockList.vue";
import { useFriendsStore } from "@/store/friends.store";
import { useUserStore } from "@/store/user.store";

const appStore = useAppStore();
const chatStore = useChatStore();
const friendsStore = useFriendsStore();
const userStore = useUserStore();
const tab = ref(0);
const promotedGroup = ref<Chat>(null);
const apolloClient = useApolloClient();
const search = ref("");
const addFriend = ref({
  username: "",
  loading: false,
  success: false
});
const tabs = ref([
  {
    title: "Feed",
    icon: "mdi-account-multiple"
  },
  {
    title: "Friends",
    icon: "mdi-account-group",
    badge: () =>
      currentFriendsOffline.value.length + currentFriendsOnline.value.length
  },
  {
    title: "Incoming",
    icon: "mdi-inbox-arrow-down",
    badge: () => incomingFriends.value.length
  },
  {
    title: "Outgoing",
    icon: "mdi-inbox-arrow-up",
    badge: () => outgoingFriends.value.length
  },
  {
    title: "Blocked",
    icon: "mdi-block-helper",
    badge: () => userStore.blocked.length
  },
  {
    title: "Add Friend",
    icon: "mdi-account-plus"
  }
]);

async function getPromotedChat() {
  if (!appStore.site.officialInstance) return;
  const chat = await apolloClient.client.query({
    query: ChatInviteQuery,
    variables: {
      input: {
        inviteId: "flowinity"
      }
    }
  });
  promotedGroup.value = chat.data.chatInvite.chat;
}

onMounted(() => {
  appStore.title = "Communications";
  appStore.railMode = "communications";
  getPromotedChat();
});

const recentChats = computed(() => {
  // find ones with _redisSortDate within 48h
  const chats = chatStore.chats.filter((chat) => {
    return chat._redisSortDate > Date.now() - 48 * 60 * 60 * 1000;
  });
  return promotedGroup.value ? [...chats, promotedGroup.value] : chats;
});

const currentFriendsOnline = computed(() => {
  return friendsStore.friends.filter(
    (friend) =>
      friend.status === FriendStatus.Accepted &&
      userStore.users[friend.friendId]?.status !== UserStatus.Offline
  );
});

const currentFriendsOffline = computed(() => {
  return friendsStore.friends.filter(
    (friend) =>
      friend.status === FriendStatus.Accepted &&
      userStore.users[friend.friendId]?.status === UserStatus.Offline
  );
});

const incomingFriends = computed(() => {
  return friendsStore.friends.filter(
    (friend) => friend.status === FriendStatus.Incoming
  );
});

const outgoingFriends = computed(() => {
  return friendsStore.friends.filter(
    (friend) => friend.status === FriendStatus.Outgoing
  );
});

const searchWrapper: ComputedRef<BlockedUser[] | Friend[]> = computed(() => {
  if (tab.value === 1) {
    return currentFriendsOnline.value
      .concat(currentFriendsOffline.value)
      .filter((friend) =>
        friend.user.username.toLowerCase().includes(search.value.toLowerCase())
      );
  } else if (tab.value === 2) {
    return incomingFriends.value.filter((friend) =>
      friend.user.username.toLowerCase().includes(search.value.toLowerCase())
    );
  } else if (tab.value === 3) {
    return outgoingFriends.value.filter((friend) =>
      friend.user.username.toLowerCase().includes(search.value.toLowerCase())
    );
  } else if (tab.value === 4) {
    return userStore.blocked.filter((friend) =>
      friend.blockedUser.username
        .toLowerCase()
        .includes(search.value.toLowerCase())
    );
  }
  return [];
});

async function sendFriendRequest() {
  addFriend.value.loading = true;
  try {
    await friendsStore.actOnFriend(addFriend.value.username, FriendAction.Send);
    addFriend.value.username = "";
    addFriend.value.success = true;
    setTimeout(() => {
      addFriend.value.success = false;
    }, 5000);
  } finally {
    addFriend.value.loading = false;
  }
}
</script>

<style scoped>
.friend-button {
  transition: all 0.3s;
}
</style>
