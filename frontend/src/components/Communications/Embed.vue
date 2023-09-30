<template>
  <template v-if="embed.data">
    <v-card v-if="embed.type === 'openGraph'" :max-width="500" elevation="0">
      <v-card-text class="text-overline">
        {{ embed?.data?.siteName }}
      </v-card-text>
      <v-card-text class="mt-n8" style="font-size: 15px">
        {{ embed?.data?.title }}
      </v-card-text>
      <v-card-text class="mt-n8" style="font-size: 13px">
        {{ embed?.data?.description }}
      </v-card-text>
    </v-card>
    <v-card v-else-if="embed.type === 'bot'" :max-width="500" elevation="0">
      <v-card-text class="text-overline">
        {{ embed?.data?.siteName }}
      </v-card-text>
      <v-card-text class="mt-n8" style="font-size: 15px">
        {{ embed?.data?.title }}
      </v-card-text>
      <v-card-text
        class="mt-n8"
        style="font-size: 13px; white-space: pre-line"
        v-memo="embed?.data?.description"
        v-html="$functions.markdown(embed?.data?.description, null)"
      ></v-card-text>
    </v-card>
    <div v-else-if="embed.type === 'image'">
      <img
        :style="{
          maxWidth: width <= 500 + 'px' ? width + 'px' : 500 + 'px',
          maxHeight:
            embed.data.height > 400 ? 700 + 'px' : embed.data.height * 2 + 'px'
        }"
        :src="embed.data.url"
        class="pointer rounded-xl mb-1"
        @click="
          $chat.dialogs.image.object = embed.data;
          $chat.dialogs.image.value = true;
        "
      />
    </div>
    <v-card
      v-else-if="embed.type === 'file'"
      :max-height="500"
      :max-width="width"
      elevation="0"
    >
      <v-card-text>
        <v-icon :size="48" class="mr-2">mdi-file</v-icon>
        <span>
          {{ embed.data.upload.name }}
        </span>
      </v-card-text>
      <v-card-actions class="text-grey">
        {{ $functions.fileSize(embed.data.upload.fileSize) }}
        <v-spacer />
        <v-btn
          :href="`https://i.troplo.com/i/${embed.data?.upload?.attachment}`"
          icon
          target="_blank"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="embed.type === 'video'" :max-width="width" elevation="0">
      <video :style="'max-width:' + width + 'px;'" controls height="300">
        <source :src="$app.domain + embed.data.upload.attachment" />
      </video>
    </v-card>
    <v-card
      v-else-if="embed.data.type === 'TPU_CHAT_INVITE'"
      :max-width="width"
    >
      <template v-if="invite">
        <v-img
          :src="$app.domain + invite.chat.background"
          v-if="invite.chat.background"
          cover
          max-height="100"
        ></v-img>
        <overline position="start" class="mb-n2">
          You have been invited to a group by
          <UserAvatar :user="invite.user" size="20" />
          {{ invite.user.username }}
        </overline>
        <v-card-title>
          {{ invite.chat.name }}
        </v-card-title>
        <v-card-subtitle class="mt-n2 mb-2">
          {{ invite.chat.description }}
        </v-card-subtitle>
        <v-btn
          variant="outlined"
          class="ml-3 mb-2"
          @click="join"
          :loading="loadingInvite"
          v-if="!$chat.chats.find((chat) => chat.id === invite.chat.id)"
        >
          Join
        </v-btn>
        <v-btn
          variant="outlined"
          class="ml-3 mb-2"
          @click="
            $router.push(
              `/communications/${
                $chat.chats.find((chat) => chat.id === invite.chat.id)
                  ?.association?.id
              }`
            )
          "
          :loading="loadingInvite"
          v-else
        >
          Go
        </v-btn>
        <br />
        <small class="ml-3 mb-2" v-if="invite.expiredAt">
          Expires in {{ $date(invite.expiredAt).fromNow() }}
        </small>
      </template>
      <template v-else-if="loadingInvite">
        <v-card-title>Resolving...</v-card-title>
      </template>
      <template v-else>
        <v-card-title>
          <v-icon class="text-gradient" size="28">mdi-gift-off</v-icon>
          The invite has expired
          <img
            class="emoji"
            draggable="false"
            alt="😦"
            src="/emoji/emoji_u1f626.svg"
            style="top: 0.3em"
          />
        </v-card-title>
        <v-card-subtitle class="mb-2">
          You can't join this group right now as the invite is no longer valid.
        </v-card-subtitle>
      </template>
    </v-card>
    <v-card v-else elevation="0">
      You must upgrade your version of TPUvNEXT to see the embed type
      {{ embed.type }}!
    </v-card>
  </template>
  <template v-else>
    <v-card class="elevation-0" color="toolbar" width="300">
      <v-container>This embed cannot be loaded.</v-container>
    </v-card>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ChatInvite } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "Embed",
  components: { UserAvatar, Overline },
  props: ["embed"],
  computed: {
    width() {
      if (this.$vuetify.display.width < 600) return undefined;
      if (this.$vuetify.display.width <= 1366) return 350;
      return 700;
    }
  },
  data() {
    return {
      invite: null as ChatInvite | null,
      loadingInvite: false
    };
  },
  methods: {
    async getInvite(id: string) {
      if (!this.embed?.data?.id) return;
      this.loadingInvite = true;
      this.invite = await this.$chat.getInvite(id);
      this.loadingInvite = false;
    },
    async join() {
      if (!this.embed?.data?.id) return;
      try {
        this.loadingInvite = true;
        const data = await this.$chat.joinInvite(this.embed?.data?.id);
        this.loadingInvite = false;
        this.$router.push(`/communications/${data.id}`);
      } catch {
        this.loadingInvite = false;
      }
    }
  },
  mounted() {
    if (this.embed?.data?.type === "TPU_CHAT_INVITE") {
      this.getInvite(this.embed?.data?.id);
    }
  }
});
</script>

<style scoped></style>
