<template>
  <v-card-text class="text-overline">Mutual Collections</v-card-text>
  <v-card-text class="subtitle-1 mt-n6">
    <v-slide-group>
      <CollectionCard
        v-for="collection in user.mutualCollections"
        :key="collection.id"
        :item="collection"
        class="mr-4"
        style="width: 400px"
      />
    </v-slide-group>
  </v-card-text>
</template>

<script lang="ts" setup>
import CollectionCard from "@/components/Collections/CollectionCard.vue";

defineProps(["user", "username"]);
</script>
