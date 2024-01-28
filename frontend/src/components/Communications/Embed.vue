<template>
  <template v-if="embed.metadata">
    <component
      :is="embed.text.length ? VCard : 'div'"
      :class="{
        'pl-4': embed.text.length
      }"
      :style="{
        maxWidth: width >= 500 ? 500 + 'px' : width + 'px'
      }"
    >
      <div v-for="(text, index) in embed.text" :key="index">
        <v-card-text
          v-if="index === 0 && embed.metadata.siteName"
          class="text-overline"
          style="padding-bottom: 0; padding-left: 0"
        >
          {{ embed.metadata.siteName }}
        </v-card-text>
        <v-card-text
          style="padding-bottom: 6px; padding-top: 6px; padding-left: 0"
          :class="{
            'text-grey': !text.heading
          }"
        >
          {{ text.text }}
        </v-card-text>
      </div>
      <div v-for="(media, index) in embed.media" :key="index">
        <template
          v-if="
            media.type === EmbedMediaType.Image ||
            media.type === EmbedMediaTypeLegacy.IMAGE
          "
        >
          <img
            v-if="(media.isInternal && media.upload) || !media.isInternal"
            :style="{
              maxWidth:
                media.width <= 400
                  ? media.width + 'px'
                  : media.width - 70 + 'px',
              maxHeight:
                media.height > 400 ? 700 + 'px' : media.height * 2 + 'px',
              width: '100%'
            }"
            :src="
              media.isInternal ? $app.domain + media.attachment : media.proxyUrl
            "
            class="pointer rounded-xl mb-1"
            alt="Embedded image"
            @click="
              $chat.dialogs.image.object = media;
              $chat.dialogs.image.value = true;
            "
          />
          <DeletedFile v-else />
        </template>
        <div
          v-else-if="
            media.type === EmbedMediaType.File ||
            media.type === EmbedMediaTypeLegacy.FILE
          "
        >
          <template v-if="media.upload">
            <v-card-text>
              <v-icon :size="48" class="mr-2">mdi-file</v-icon>
              <span>
                {{ media.upload.name }}
              </span>
            </v-card-text>
            <v-card-actions class="text-grey">
              {{ $functions.fileSize(media.upload.fileSize) }}
              <v-spacer />
              <v-btn
                :href="`${$app.domain}${media.attachment}`"
                icon
                target="_blank"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-card-actions>
          </template>
          <DeletedFile v-else />
        </div>
        <v-card
          v-else-if="
            (media.type === EmbedMediaType.Video ||
              media.type === EmbedMediaTypeLegacy.VIDEO) &&
            media.upload &&
            !media.videoEmbedUrl
          "
          :max-width="width >= 500 ? 500 : width"
          elevation="0"
        >
          <video :style="'max-width:' + width + 'px;'" controls>
            <source :src="$app.domain + media.attachment" />
          </video>
        </v-card>
        <v-card v-else-if="media.videoEmbedUrl" class="ml-n3 mb-1 mr-1 mt-1">
          <div class="video-container">
            <iframe :src="media.videoEmbedUrl" allowfullscreen></iframe>
          </div>
        </v-card>
        <v-card v-else-if="embed.type" elevation="0">
          You must upgrade your version of TPUvNEXT to see the embed type
          {{ embed.type }}!
        </v-card>
        <DeletedFile v-else />
      </div>
    </component>
    <v-card v-if="embed.metadata.type === 'CHAT_INVITE'" :max-width="width">
      <template v-if="invite">
        <v-img
          v-if="invite.chat.background"
          :src="$app.domain + invite.chat.background"
          cover
          max-height="100"
        />
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
          v-if="!$chat.chats.find((chat) => chat.id === invite.chat.id)"
          variant="outlined"
          class="ml-3 mb-2"
          :loading="loadingInvite"
          @click="join"
        >
          Join
        </v-btn>
        <v-btn
          v-else
          variant="outlined"
          class="ml-3 mb-2"
          :loading="loadingInvite"
          @click="
            $router.push(
              `/communications/${
                $chat.chats.find((chat) => chat.id === invite.chat.id)
                  ?.association?.id
              }`
            )
          "
        >
          Go
        </v-btn>
        <br />
        <small v-if="invite.expiredAt" class="ml-3 mb-2">
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
  </template>
  <template v-else>
    <v-card class="elevation-0" color="toolbar" width="300">
      <v-container>This embed cannot be loaded.</v-container>
    </v-card>
  </template>
</template>

<script lang="ts" setup>
import DeletedFile from "@/components/Communications/DeletedFile.vue";

enum EmbedMediaTypeLegacy {
  IMAGE,
  VIDEO,
  AUDIO,
  FILE
}
</script>

<script lang="ts">
import { defineComponent } from "vue";
import { ChatInvite, EmbedMediaType } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { VCard } from "vuetify/components";

export default defineComponent({
  components: { UserAvatar, Overline },
  props: ["embed"],
  emits: ["autoScroll"],
  data() {
    return {
      invite: null as ChatInvite | null,
      loadingInvite: false
    };
  },
  computed: {
    EmbedMediaTypeLegacy() {
      return EmbedMediaType;
    },
    VCard() {
      return VCard;
    },
    width() {
      if (this.$vuetify.display.width < 600) return undefined;
      if (this.$vuetify.display.width <= 1366) return 350;
      return 700;
    }
  },
  mounted() {
    if (this.embed?.data?.type === "TPU_CHAT_INVITE") {
      this.getInvite(this.embed?.data?.id);
    }
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
  }
});
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
}

.video-container iframe {
  position: absolute;
  border: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
