<template>
  <v-menu
    :model-value="modelValue"
    activator="parent"
    location="top right"
    :close-on-content-click="false"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card height="500" width="500">
      <div class="d-flex flex-row">
        <v-tabs direction="vertical" v-model="tab">
          <v-tab :value="category.key" v-for="category in categories">
            {{ category.title }}
          </v-tab>
        </v-tabs>
        <v-card-text v-if="modelValue">
          <v-window v-model="tab">
            <v-window-item :value="category.key" v-for="category in categories">
              <v-card max-width="300" color="transparent" class="elevation-0">
                <v-text-field v-model="search" label="Search" />
                <v-row>
                  <v-col v-for="emoji in emojis" :key="emoji.hexcode">
                    <v-btn
                      icon
                      class="d-flex justify-center"
                      @click="
                        $emit('emoji', emoji.unicode);
                        $emit('update:modelValue', false);
                      "
                    >
                      <img
                        height="32"
                        :src="`/all.svg#${emoji.hexcode}`"
                        :alt="emoji.label"
                      />
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
//@ts-ignore
import { Notomoji } from "@svgmoji/noto";
//@ts-ignore
import data from "../../../assets/compact.raw.json";

export default defineComponent({
  name: "EmojiPicker",
  props: ["modelValue"],
  emits: ["update:modelValue", "emoji"],
  data() {
    return {
      tab: 0,
      search: "",
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
  computed: {
    emojis() {
      const filtered = data.filter((emoji: any) => emoji.group === this.tab);
      if (this.search) {
        return filtered.filter((emoji: any) =>
          emoji.label.includes(this.search)
        );
      }
      return filtered;
    }
  }
});
</script>

<style scoped></style>
