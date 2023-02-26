<template>
  <v-toolbar
    ref="toolbar"
    height="auto"
    style="z-index: 1001"
    color="transparent"
  >
    <Mentionable
      :keys="['@']"
      :items="users"
      offset="6"
      insert-space
      @open="onOpen"
      :omit-key="true"
    >
      <v-textarea
        ref="textarea"
        :class="!editing ? 'mb-n5 mt-1' : 'mt-2'"
        label="Type a message..."
        placeholder="Keep it civil"
        variant="outlined"
        append-icon="mdi-send"
        @update:model-value="$emit('update:modelValue', $event)"
        :model-value="modelValue"
        density="compact"
        rows="1"
        auto-grow
        autofocus
        color="primary"
        @keydown.enter.exact.prevent="$emit('sendMessage')"
        @click:append="$emit('sendMessage')"
        @keyup.esc="$emit('edit', null)"
        :key="renderKey"
      >
        <template v-slot:prepend v-if="!editing">
          <v-menu
            location="top"
            activator="parent"
            :close-on-content-click="false"
            v-model="menu"
          >
            <v-card height="500" max-width="700">
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
                      hide-input
                      ref="uploadInput"
                      style="display: none"
                      truncate-length="15"
                      multiple
                      @update:model-value="$emit('fileUpload', $event)"
                    ></v-file-input>
                    <v-row
                      @click="handleClick"
                      style="cursor: pointer"
                      class="d-flex flex-column"
                      dense
                      align="center"
                      justify="center"
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
          <v-icon class="pointer">mdi-plus-circle</v-icon>
        </template>
        <template v-slot:append-inner>
          <v-icon
            class="mr-2"
            v-if="!editing"
            @click="
              menu = true;
              tab = 'starred';
            "
          >
            mdi-star
          </v-icon>
          <template>
            <v-icon class="pointer text-grey">mdi-emoticon</v-icon>
          </template>
        </template>
        <template v-slot:details v-if="!editing">
          <span class="details-container">
            {{ $chat.typers }}
          </span>
        </template>
      </v-textarea>
    </Mentionable>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PersonalGallery from "@/views/Starred.vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import InlineGallery from "@/components/Communications/InlineGallery.vue";
import Mentionable from "@/components/Core/Mentionable.vue";
import EmojiPicker from "@/components/Communications/Menus/Emoji.vue";
import emoji from "@/components/Communications/Menus/Emoji.vue";

export default defineComponent({
  name: "CommunicationsInput",
  components: {
    EmojiPicker,
    InlineGallery,
    GalleryCore,
    PersonalGallery,
    Mentionable
  },
  props: ["modelValue", "editing", "renderKey"],
  emits: [
    "update:modelValue",
    "sendMessage",
    "edit",
    "fileUpload",
    "quickTPULink"
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
      return this.$chat.selectedChat?.users.map((user: any) => {
        return {
          label: user.user?.username,
          value: user.user?.id
        };
      });
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
</style>
