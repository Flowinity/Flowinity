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

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  name: "MutualCollections",
  components: { Overline, CollectionCard },
  props: ["user", "username"]
});
</script>
