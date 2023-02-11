<template>
  <v-card class="mx-auto mt-6" elevation="6" max-width="1000">
    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="image" contain></v-img>
      </v-col>
      <v-col cols="12" md="5">
        <v-card-title class="mb-2 display-1">{{ title }}</v-card-title>
        <v-card-text class="">
          <slot></slot>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "PromoCard",
  props: ["title", "image"]
};
</script>

<style scoped></style>
