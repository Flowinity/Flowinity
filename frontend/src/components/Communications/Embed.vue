<template>
  <template v-if="embed.data">
    <v-card v-if="embed.type === 'openGraph'" :width="width" elevation="0">
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
    <v-img
      v-else-if="embed.type === 'image'"
      :aspect-ratio="embed.data.width / embed.data.height"
      :max-height="embed.data.height > 400 ? 700 : embed.data.height * 2"
      :max-width="500"
      :src="embed.data.url"
      :width="width"
      class="pointer rounded-xl mb-1"
      @click="
        $chat.dialogs.image.object = embed.data;
        $chat.dialogs.image.value = true;
      "
    ></v-img>
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
      <video
        :src="$app.domain + embed.data.upload.attachment"
        :style="'max-width:' + width + 'px;'"
        controls
      ></video>
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
