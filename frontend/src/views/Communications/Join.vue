<template>
  <div
    class="invite d-flex justify-center align-center"
    :style="{
      background: invite?.chat?.background
        ? `url(${$app.domain + invite.chat.background})`
        : undefined,
      'background-repeat': invite?.chat?.background ? 'no-repeat' : undefined,
      'background-size': invite?.chat?.background ? 'cover' : undefined
    }"
  >
    <v-card max-width="600" class="text-center mx-3 px-3 pt-3" v-if="invite">
      <UserAvatar :chat="invite.chat" size="64" />
      <v-card-title class="initial">
        Join {{ invite.chat.name }} on Communications!
        <v-card-subtitle>
          {{ invite.chat.users.length }} members
        </v-card-subtitle>
        <v-card-subtitle v-if="invite.rank" class="initial">
          You will be auto-assigned the rank
          <strong :style="{ color: invite.rank.color || 'unset' }">
            {{ invite.rank.name }}
          </strong>
        </v-card-subtitle>
      </v-card-title>
      <v-card-subtitle class="initial">
        {{
          invite.chat.description ||
          "Get involved in the conversation today, only on PrivateUploader!"
        }}
      </v-card-subtitle>
      <v-card-actions>
        <v-btn to="/" :active="false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="join" v-if="$user.user">Join</v-btn>
        <v-btn
          color="blue"
          @click="
            $router.push(
              `/login?redirect=${$route.fullPath
                .replaceAll('?', '%3F')
                .replaceAll('&', '%26')}`
            )
          "
          v-else
        >
          Login & Join
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      min-width="500"
      class="text-center pt-4"
      v-else-if="!$app.componentLoading"
    >
      <v-icon class="text-gradient" size="48">mdi-gift-off</v-icon>
      <v-card-title>
        The invite has expired
        <img
          class="emoji"
          draggable="false"
          alt="😦"
          src="/emoji/emoji_u1f626.svg"
          style="top: 0.3em"
        />
      </v-card-title>
      <v-card-subtitle>
        You can't join this group right now as the invite is no longer valid.
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" to="/" :active="false">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ChatInvite } from "@/gql/graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "ChatJoin",
  components: { UserAvatar },
  data() {
    return {
      invite: undefined as ChatInvite | null | undefined,
      loading: false
    };
  },
  methods: {
    async getInvite() {
      try {
        this.$app.componentLoading = true;
        this.invite = await this.$chat.getInvite(this.$route.params.id);
      } finally {
        this.$app.componentLoading = false;
        this.$app.title = this.invite
          ? `Join ${this.invite.chat.name} on PrivateUploader!`
          : "Invalid Invite";
      }
    },
    async join() {
      this.loading = true;
      const data = await this.$chat.joinInvite(this.invite.id);
      this.loading = false;
      this.$router.push(`/communications/${data.id}`);
    }
  },
  async mounted() {
    this.getInvite();
  },
  watch: {
    "$route.params.id"(val) {
      if (!val) return;
      this.getInvite();
    }
  }
});
</script>
