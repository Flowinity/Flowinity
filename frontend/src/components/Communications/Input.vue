<template>
  <div style="width: 100%">
    <Mentionable
      :items="users"
      :keys="['@']"
      :omit-key="true"
      insert-space
      offset="6"
      @open="onOpen"
      :model-value="modelValue"
      :id="`#${editing ? 'input-editing' : 'input-main-comms'}`"
    >
      <template v-slot:item="{ item }">
        <div class="my-2 mx-2">
          <UserAvatar
            :size="35"
            :user="$chat.lookupUser(item.value)"
            class="mr-1"
          ></UserAvatar>
          {{ $chat.lookupUser(item.value).username }}
        </div>
      </template>
    </Mentionable>
    <v-toolbar
      :id="editing ? '' : 'chat-input'"
      ref="toolbar"
      :color="editing ? 'transparent' : 'dark'"
      height="auto"
      class="mb-1"
    >
      <div class="d-flex flex-column" style="width: 100%">
        <v-textarea
          ref="textarea"
          :class="!editing ? 'mb-n4 mt-1' : 'mt-2'"
          :maxlength="2000"
          :model-value="modelValue"
          auto-grow
          :autofocus="true"
          color="primary"
          density="compact"
          :label="
            blocked?.value
              ? blocked.you
                ? $t('dialogs.block.commsInputYou')
                : $t('dialogs.block.commsInputThem')
              : 'Type a message...'
          "
          :disabled="blocked?.value"
          placeholder="Keep it civil"
          rows="1"
          variant="outlined"
          @update:model-value="$emit('update:modelValue', $event)"
          @keydown.enter.exact="
            isMobile ? null : $event.preventDefault();
            isMobile ? null : $emit('sendMessage');
          "
          @click:append="$emit('sendMessage')"
          @keyup.esc="$emit('edit', null)"
          @keydown.up="editing ? cursor($event, true) : null"
          @keydown.down="editing ? cursor($event, false) : null"
          :id="editing ? 'input-editing' : 'input-main-comms'"
          style="padding: 16px; width: 100%"
        >
          <template v-slot:append>
            <v-icon
              class="pointer raw-icon"
              @click.prevent.stop="$emit('sendMessage')"
            >
              mdi-send
            </v-icon>
          </template>
          <template v-if="!editing" v-slot:prepend>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              activator="parent"
              location="top"
            >
              <v-card
                :width="$vuetify.display.mobile ? undefined : 700"
                height="500"
                max-width="700"
              >
                <v-tabs v-model="tab" align-tabs="center">
                  <v-tab value="upload">Upload</v-tab>
                  <v-tab value="gallery">Gallery</v-tab>
                  <v-tab value="starred">Starred</v-tab>
                  <v-tab value="gif">GIFs</v-tab>
                </v-tabs>
                <v-card-text>
                  <v-window v-model="tab">
                    <v-window-item value="upload">
                      <v-file-input
                        ref="uploadInput"
                        hide-input
                        multiple
                        style="display: none"
                        truncate-length="15"
                        @update:model-value="$emit('fileUpload', $event)"
                      ></v-file-input>
                      <v-row
                        align="center"
                        class="d-flex flex-column"
                        dense
                        justify="center"
                        style="cursor: pointer"
                        @click="handleClick"
                      >
                        <v-icon size="60">mdi-cloud-upload</v-icon>
                        <p>Drop your file(s) here, or click to select them.</p>
                      </v-row>
                    </v-window-item>

                    <v-window-item value="gallery">
                      <InlineGallery
                        type="gallery"
                        @clickItem="
                          $emit('quickTPULink', $event);
                          menu = false;
                        "
                      ></InlineGallery>
                    </v-window-item>
                    <v-window-item value="starred">
                      <InlineGallery
                        type="starred"
                        @clickItem="
                          $emit('quickTPULink', $event);
                          menu = false;
                        "
                      ></InlineGallery>
                    </v-window-item>
                    <v-window-item value="gif">
                      <InlineGallery
                        type="tenor"
                        @clickItem="
                          $emit('quickTPULink', $event);
                          menu = false;
                        "
                      ></InlineGallery>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-menu>
            <v-icon class="pointer raw-icon">mdi-plus-circle</v-icon>
          </template>
          <template v-slot:append-inner>
            <EmojiPicker
              v-model="emojiPicker"
              @emoji="$emit('emoji', $event)"
            ></EmojiPicker>
            <v-icon class="pointer raw-icon">mdi-emoticon</v-icon>
          </template>
        </v-textarea>
        <div v-if="!editing" style="margin-top: 2px">
          <span
            class="float-start mt-n5 text-grey ml-14"
            style="font-size: 12px; color: white"
          >
            {{ $chat.typers }}
          </span>
          <span
            class="float-end mt-n1 mt-n5 text-grey mr-14"
            style="font-size: 12px; color: white"
          >
            {{ modelValue?.length }} / 4000
          </span>
        </div>
      </div>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import InlineGallery from "@/components/Communications/InlineGallery.vue";
import Mentionable from "@/components/Core/Mentionable.vue";
import EmojiPicker from "@/components/Communications/Menus/Emoji.vue";
import emoji from "@/components/Communications/Menus/Emoji.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "CommunicationsInput",
  components: {
    UserAvatar,
    EmojiPicker,
    InlineGallery,
    GalleryCore,
    Mentionable
  },
  props: ["modelValue", "editing", "blocked"],
  emits: [
    "update:modelValue",
    "sendMessage",
    "edit",
    "fileUpload",
    "quickTPULink",
    "emoji",
    "focusInput"
  ],
  data() {
    return {
      tab: null as string | null,
      menu: false,
      items: [] as any,
      emojiPicker: false
    };
  },
  computed: {
    emoji() {
      return emoji;
    },
    users() {
      if (!this.$chat.selectedChat?.users) return [];
      return this.$chat.selectedChat?.users
        .filter((user) => !user.legacyUserId)
        .map((user: any) => {
          return {
            label: this.$user.users[user.userId]?.username,
            value: this.$user.users[user.userId]?.id
          };
        });
    },
    isMobile() {
      return (
        this.$vuetify.display.platform.android ||
        this.$vuetify.display.platform.ios
      );
    }
  },
  methods: {
    focus() {
      //@ts-ignore
      this.$refs?.textarea?.focus();
    },
    handleClick() {
      //@ts-ignore
      this.$refs?.uploadInput?.click();
    },
    onOpen(key: string) {
      this.items = key === "@" ? this.$chat.selectedChat?.users : [];
    },
    cursor(e, up: boolean) {
      e.preventDefault();
      e.stopPropagation();
      //@ts-ignore
      const textarea: HTMLInputElement =
        document.getElementById("input-editing");
      if (!textarea) return;
      if (up) textarea.setSelectionRange(0, 0);
      else
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
    }
  }
});
</script>

<style>
.details-container {
  align-items: flex-start !important;
  justify-content: flex-start !important;
  display: flex;
  width: 100%;
  height: 25px;
}

.v-counter {
  margin-top: -50px !important;
  width: 20em;
}
</style>
