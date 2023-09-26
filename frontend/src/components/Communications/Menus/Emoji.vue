<template>
  <v-menu
    :close-on-content-click="false"
    :model-value="modelValue"
    activator="parent"
    location="top right"
    @update:model-value="$emit('update:modelValue', $event)"
    height="500"
  >
    <v-card width="500" class="position-relative">
      <div class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical">
          <v-tab
            v-for="chat in chatEmojis"
            :value="chat.id"
            :key="chat.id"
            @click="type = 'chat'"
          >
            {{ chat.name }}
          </v-tab>
          <v-divider class="mb-2"></v-divider>
          <v-tab
            v-for="category in categories"
            :value="category.key"
            :key="category.key"
          >
            {{ category.title }}
          </v-tab>
        </v-tabs>
        <v-card-text v-if="modelValue">
          <div v-for="chat in chatEmojis" :key="chat.id + '-chat'">
            <overline position="start">
              {{ chat.name }}
            </overline>
            <div
              class="d-grid"
              style="grid-template-columns: auto auto auto auto"
            >
              <v-btn
                v-for="emoji of chat.emoji"
                icon
                @click="$emit('emoji', `:${emoji.name}:`)"
                @mouseover="hover = emoji"
              >
                <v-img :src="$app.domain + emoji.icon" width="30" />
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <div style="position: fixed; bottom: 0; width: 100%">
          <v-toolbar style="width: 100%">
            <template v-if="hover">
              <div class="d-flex mx-4">
                <v-img :src="$app.domain + hover.icon" width="60" />
              </div>
              :{{ hover.name }}:
            </template>
            <template v-else>
              <div class="d-flex mx-4">
                <v-icon size="40">mdi-emoticon</v-icon>
              </div>
              Hover over something to preview.
            </template>
          </v-toolbar>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import data from "markdown-it-emoji/lib/data/full.json";
import InfiniteLoading from "v3-infinite-loading";
import Grid from "vue-virtual-scroll-grid";
import { Chat, ChatEmoji } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  name: "EmojiPicker",
  props: ["modelValue"],
  emits: ["update:modelValue", "emoji"],
  components: {
    Overline,
    InfiniteLoading,
    Grid
  },
  data() {
    return {
      tab: 0,
      search: "",
      page: 1,
      type: "chat" as "chat" | "native",
      hover: null as ChatEmoji | null,
      categories: [
        {
          key: 0,
          title: "Smiles & Emotion",
          u: "1f551"
        },
        {
          key: 1,
          title: "People & Body",
          u: "1f600"
        },
        {
          key: 2,
          title: "Components",
          u: "1F431"
        },
        {
          key: 3,
          title: "Animals & Nature",
          u: "2615"
        },
        {
          key: 4,
          title: "Food & Drink",
          u: "26BD"
        },
        {
          key: 5,
          title: "Travel & Places",
          u: "1F697"
        },
        {
          key: 6,
          title: "Activities",
          u: "1F4A1"
        },
        {
          key: 7,
          title: "Objects",
          u: "1f4af"
        },
        {
          key: 8,
          title: "Symbols",
          u: "1f3f3-fe0f"
        },
        {
          key: 9,
          title: "Flags",
          u: "1f1e6-1f1e8"
        }
      ]
    };
  },
  methods: {
    async getEmojis(pageNumber: number, pageSize: number) {
      return Promise.resolve(
        this.emojis.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
      );
    }
  },
  computed: {
    emojis() {
      return Object.entries(data);
    },
    chatEmojis() {
      const map: Chat[] = [];
      for (const emoji of this.$chat.emoji) {
        const existingIndex = map.findIndex((chat) => chat.id === emoji.chatId);
        if (existingIndex !== -1) {
          map[existingIndex].emoji.push(emoji);
        } else {
          const chat = this.$chat.chats.find(
            (chat) => chat.id === emoji.chatId
          );
          if (!chat) continue;
          map.push({
            ...chat,
            emoji: [emoji]
          });
        }
      }
      return map;
    }
  }
});
</script>
