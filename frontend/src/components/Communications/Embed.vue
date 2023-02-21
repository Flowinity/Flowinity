<template>
  <v-card v-if="embed.type === 'openGraph'" elevation="0" :width="width">
    <v-card-text class="text-overline">
      {{ embed.data.siteName }}
    </v-card-text>
    <v-card-text class="mt-n8" style="font-size: 15px">
      {{ embed.data.title }}
    </v-card-text>
  </v-card>
  <v-card
    v-else-if="embed.type === 'image'"
    elevation="0"
    :max-width="width"
    :max-height="500"
    :height="embed.data.height"
    :width="embed.data.width"
  >
    <v-img
      :src="embed.data.url"
      :height="embed.data.height"
      :width="embed.data.width"
      :max-width="width"
      :max-height="500"
      :aspect-ratio="embed.data.width / embed.data.height"
      class="pointer"
      @click="
        $chat.dialogs.image.object = embed.data;
        $chat.dialogs.image.value = true;
      "
    ></v-img>
  </v-card>
  <v-card
    v-else-if="embed.type === 'file'"
    elevation="0"
    :max-width="width"
    :max-height="500"
  >
    <v-card-text>
      <v-icon class="mr-2" :size="48">mdi-file</v-icon>
      <span>
        {{ embed.data.upload.name }}
      </span>
    </v-card-text>
    <v-card-actions class="text-grey">
      {{ $functions.fileSize(embed.data.upload.fileSize) }}
      <v-spacer />
      <v-btn
        :href="`https://i.troplo.com/i/${embed.data?.upload?.attachment}`"
        target="_blank"
        icon
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else elevation="0">
    You must upgrade your version of TPUvNEXT to see the embed type
    {{ embed.type }}!
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Embed",
  props: ["embed"],
  computed: {
    width() {
      if (this.$vuetify.display.width < 600) return undefined;
      if (this.$vuetify.display.width <= 1366) return 350;
      return 700;
    }
  }
});
</script>

<style scoped></style>
