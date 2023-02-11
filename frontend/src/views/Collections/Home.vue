<template>
  <v-container>
    <v-row>
      <v-col
        v-for="item in $collections.items"
        :key="'item-' + item.id + '-' + (item.shared ? 'shared' : 'owned')"
        md="3"
      >
        <CollectionCard :item="item"> </CollectionCard>
      </v-col>
    </v-row>
    <small> Total Items: {{ $collections.items.length }} </small>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";

export default defineComponent({
  name: "CollectionsHome",
  components: { CollectionCard },
  setup() {
    return {};
  },
  mounted() {
    this.$collections.init();
  }
});
</script>

<style scoped></style>
