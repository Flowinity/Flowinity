<template>
  <div>
    <v-hover v-if="item.type === 'image'">
      <template v-slot:default="{ isHovering, props }">
        <v-img
          :src="domain + item.attachment"
          contain
          height="220"
          v-bind="props"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
          <a :href="domain + item.attachment" target="_blank">
            <v-overlay
              contained
              :model-value="isHovering"
              class="align-center justify-center"
            >
              <v-icon large color="white" size="40">mdi-open-in-new</v-icon>
            </v-overlay>
          </a>
        </v-img>
      </template>
    </v-hover>
    <video width="100%" height="298" v-else-if="item.type === 'video'" controls>
      <source :src="domain + item.attachment" type="video/mp4" />
    </video>
    <audio controls v-else-if="item.type === 'audio'">
      <source :src="domain + item.attachment" type="audio/mpeg" />
    </audio>
    <v-card
      class="d-flex align-center justify-center"
      height="220"
      elevation="0"
      v-else
    >
      <v-icon size="100" color="grey">mdi-file</v-icon>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "GalleryPreview",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      domain: "https://i.troplo.com/i/"
    };
  }
};
</script>

<style scoped></style>
