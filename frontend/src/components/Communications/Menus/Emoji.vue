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
          <v-divider class="mb-2"></v-divider>
          <v-tab :value="0">All</v-tab>
          <v-divider class="my-1"></v-divider>
          <v-tab v-for="chat in chatEmojis" :value="chat.id" :key="chat.id">
            {{ chat.name }}
          </v-tab>
          <v-divider class="my-1"></v-divider>
          <v-tab :value="1">Built-in</v-tab>
        </v-tabs>
        <v-card-text v-if="modelValue">
          <v-text-field :label="$t('generic.search')" v-model="search" />
          <RecycleScroller
            class="scroller"
            :items="emojiGrid"
            key-field="id"
            :item-size="48"
            v-slot="{ item: emoji }"
            :grid-items="6"
            style="height: 330px; width: 100%"
          >
            <v-btn
              icon
              @click="$emit('emoji', `:${emoji.name}:`)"
              @mouseover="hover = emoji"
            >
              <v-img
                :src="$app.domain + emoji.icon"
                width="30"
                v-if="emoji.icon"
              />
              <v-img
                draggable="false"
                v-else
                width="30"
                :alt="emoji.id"
                :src="`/emoji/emoji_u${emoji.id
                  .codePointAt(0)
                  ?.toString(16)}.svg`"
              ></v-img>
            </v-btn>
          </RecycleScroller>
        </v-card-text>
        <div style="position: fixed; bottom: 0; width: 100%">
          <v-toolbar style="width: 100%">
            <template v-if="hover">
              <div class="d-flex mx-4">
                <v-img
                  :src="$app.domain + hover.icon"
                  v-if="hover.icon"
                  width="50"
                  height="50"
                  draggable="false"
                />
                <v-img
                  v-else
                  draggable="false"
                  :alt="hover.name"
                  width="50"
                  height="50"
                  :src="`/emoji/emoji_u${hover.id
                    .codePointAt(0)
                    ?.toString(16)}.svg`"
                ></v-img>
              </div>
              :{{ hover.name }}:
              <v-card-subtitle v-if="hover.chatId">
                From
                {{ $chat.chats.find((chat) => chat.id === hover.chatId)?.name }}
              </v-card-subtitle>
              <v-card-subtitle v-else>Built-in</v-card-subtitle>
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
//@ts-ignore
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default defineComponent({
  name: "EmojiPicker",
  props: ["modelValue"],
  emits: ["update:modelValue", "emoji"],
  components: {
    Overline,
    InfiniteLoading,
    Grid,
    RecycleScroller
  },
  data() {
    return {
      tab: 0 as string | number,
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
    chunk<T>(arr: T[], chunkSize = 1, cache = []) {
      const tmp = [...arr];
      if (chunkSize <= 0) return cache;
      while (tmp.length) cache.push(tmp.splice(0, chunkSize));
      return cache;
    }
  },
  computed: {
    emojiGrid() {
      return [].concat(...this.searchEmojis.map((category) => category.emoji));
    },
    searchEmojis() {
      const emojis =
        this.tab === 0
          ? [...this.chatEmojis, ...this.emojis]
          : [...this.chatEmojis, ...this.emojis].filter(
              (tab) => tab.id === this.tab
            );

      return emojis
        .map((category) => {
          const filteredEmojis = category.emoji.filter((emoji) =>
            emoji.name.toLowerCase().includes(this.search.toLowerCase())
          );

          if (filteredEmojis.length > 0) {
            const filteredCategory = { ...category };
            filteredCategory.emoji = filteredEmojis;
            return filteredCategory;
          }

          return null;
        })
        .filter(Boolean);
    },
    emojis() {
      return [
        {
          id: 1,
          name: "Built-in",
          emoji: Object.entries(data).map((entry) => {
            return {
              id: entry[1],
              name: entry[0]
            };
          })
        }
      ];
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
