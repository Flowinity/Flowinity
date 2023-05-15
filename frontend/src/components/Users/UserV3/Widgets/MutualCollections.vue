<template>
  <v-card-text class="text-overline">Mutual Collections</v-card-text>
  <v-card-text class="subtitle-1 mt-n6">
    <v-slide-group>
      <CollectionCard
        v-for="collection in user.collections"
        :key="collection.id"
        :item="$collections.items.find((item) => item.id === collection.id)"
        class="mr-4"
        style="width: 400px"
      ></CollectionCard>
    </v-slide-group>
  </v-card-text>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import CollectionCard from "@/components/Collections/CollectionCard.vue"

export default defineComponent({
  name: "MutualCollections",
  components: {CollectionCard},
  props: ["user", "username"]
})
</script>

<style scoped></style>
