<template>
  <v-container>
    <div class="float-right">
      <v-btn class="rounded-xl ml-2" to="/autoCollect/configure">
        <v-icon>mdi-cog</v-icon>
        &nbsp;Configure AutoCollect
      </v-btn>
    </div>
    <br />
    <br />
    <v-row v-if="autoCollects.length">
      <v-col
        v-for="item in autoCollects"
        :key="'item-' + item.id + '-' + (item.shared ? 'shared' : 'owned')"
        md="3"
      >
        <CollectionCard :item="item" type="autoCollect"></CollectionCard>
      </v-col>
    </v-row>
    <PromoNoContent
      v-else
      icon="mdi-tooltip-check"
      title="You have no pending approvals!"
      description="You may configure AutoCollects with the button in the top right corner."
    ></PromoNoContent>
    <small>Total Items: {{ autoCollects.length }}</small>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";

export default defineComponent({
  name: "AutoCollectsHome",
  components: { PromoNoContent, CollectionCard },
  data() {
    return {
      autoCollects: [] as any[]
    };
  },
  methods: {
    async getAutoCollects() {
      const { data } = await this.axios.get("/autoCollects");
      this.autoCollects = data;
    }
  },
  mounted() {
    this.getAutoCollects();
    this.$app.title = "AutoCollects";
  }
});
</script>

<style scoped></style>
