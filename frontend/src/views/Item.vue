<template>
  <v-container fluid class="center-container" v-if="item">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="7" xl="5">
        <GalleryItem
          :item="item"
          :selected="[]"
          :supports="{
            multiSelect: false,
            collections: false,
            randomAttachment: false,
            permissions: {
              write: item?.user?.id === $user.user?.id,
              read: true
            }
          }"
        >
          <template v-slot:custom-values="{ item }">
            <v-card-subtitle style="opacity: 0.8">
              <span style="opacity: 0.6">Creator:&nbsp;</span>
              <router-link :to="`/u/${item?.user?.username}`">
                {{ item?.user?.username || "Unknown" }}
              </router-link>
            </v-card-subtitle>
          </template>
        </GalleryItem>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="!$app.componentLoading">
    <NotFound></NotFound>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import NotFound from "@/views/Errors/404.vue";
import { Upload } from "@/models/upload";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";

export default defineComponent({
  name: "Item",
  components: { GalleryItem, NotFound, GalleryPreview },
  data() {
    return {
      item: null as Upload | null
    };
  },
  methods: {
    async fetchItem() {
      try {
        this.$app.componentLoading = true;
        // Vite dev-server causes a 404 error when the path contains a dot, so we assume a png
        if (
          this.$app.site.release === "dev" &&
          !this.$route.params.id.includes(".")
        ) {
          this.$route.params.id += ".png";
        }
        const { data } = await this.axios.get(
          `/gallery/${this.$route.params.id}`,
          {
            headers: {
              noToast: true
            }
          }
        );
        this.item = data;
      } finally {
        this.$app.componentLoading = false;
      }
    }
  },
  mounted() {
    this.fetchItem();
  }
});
</script>

<style scoped>
.center-container {
  height: calc(100vh - 64px - 56px);
}
</style>
