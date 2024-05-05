<template>
  <div>
    <v-list max-height="400">
      <v-text-field
        v-model="search"
        :autofocus="true"
        class="mx-5 my-n1"
        :label="$t('generic.search')"
      />
      <v-list-item
        v-for="friend in friends"
        :key="friend.user.id"
        :active="selected.includes(friend.user.id)"
        :value="friend.user.id"
        @click="add(friend.user.id)"
      >
        <template #prepend>
          <UserAvatar :user="friend.user" class="mr-3" size="38" />
        </template>
        <template #append>
          <v-list-item-action start>
            <v-checkbox-btn
              v-if="type === ChatType.Group"
              :model-value="selected.includes(friend.user.id)"
              color="primary"
            />
            <v-radio
              v-else
              :model-value="selected.includes(friend.user.id)"
              color="primary"
            />
          </v-list-item-action>
        </template>

        <v-list-item-title>{{ friend.user.username }}</v-list-item-title>

        <v-list-item-subtitle>
          {{
            $t("chats.settings.users.addUser.friendsSince", {
              date: $date(friend.createdAt).format("DD/MM/YYYY")
            })
          }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :disabled="!selected.length && type === ChatType.Direct"
        color="primary"
        @click="createChat()"
        :loading="loading"
      >
        {{
          type === ChatType.Direct
            ? $t("chats.settings.users.addUser.createDM")
            : $t("chats.settings.users.addUser.createGroup")
        }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { ChatType, FriendStatus } from "@/gql/graphql";
import { CreateChatInviteMutation } from "@/graphql/chats/invite.graphql";

export default defineComponent({
  components: { UserAvatar },
  props: {
    type: {
      type: String as () => ChatType | null,
      required: false,
      default: ChatType.Group
    }
  },
  emits: ["done"],
  data() {
    return {
      search: "",
      selected: [] as number[],
      select: false,
      invite: null as string | null,
      rankId: null as string | null,
      expireOption: null as number | null,
      loading: false,
      expireOptions: [
        {
          title: "1 hour",
          value: 1
        },
        {
          title: "12 hours",
          value: 12
        },
        {
          title: "1 day",
          value: 24
        },
        {
          title: "7 days",
          value: 168
        },
        {
          title: "14 days",
          value: 336
        },
        {
          title: "30 days",
          value: 720
        },
        {
          title: "Never expire",
          value: null
        }
      ]
    };
  },
  computed: {
    ChatType() {
      return ChatType;
    },
    friends() {
      return this.$friends.friends.filter(
        (friend) =>
          friend.user.username
            .toLowerCase()
            .includes(this.search.toLowerCase()) &&
          friend.status === FriendStatus.Accepted
      );
    }
  },
  methods: {
    add(id: number) {
      console.log(this.type);
      if (this.type === ChatType.Direct) {
        this.selected = [id];
        return;
      }
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i) => i !== id);
      } else {
        this.selected.push(id);
      }
    },
    async createChat() {
      const data = await this.$chat.createChat(this.selected, this.type);
      this.$router.push(`/communications/${data.association.id}`);
      this.$emit("done", data);
    }
  }
});
</script>
