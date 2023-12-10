<template>
  <v-container v-if="item" class="center-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
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
          <template #custom-values="{ galleryItem }">
            <div style="display: flex; align-items: baseline">
              <v-card-subtitle style="opacity: 0.6; margin-right: -28px">
                Creator:
              </v-card-subtitle>
              <v-card-subtitle style="opacity: 0.8">
                <router-link :to="`/u/${galleryItem?.user?.username}`">
                  {{ item?.user?.username || "Unknown" }}
                </router-link>
              </v-card-subtitle>
            </div>
          </template>
        </GalleryItem>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="!$app.componentLoading">
    <NotFound />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotFound from "@/views/Errors/404.vue";
import { Upload } from "@/models/upload";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";

export default defineComponent({
  components: { GalleryItem, NotFound },
  data() {
    return {
      item: null as Upload | null
    };
  },
  mounted() {
    this.fetchItem();
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
  }
});
</script>

<style scoped>
.center-container {
  height: calc(100vh - 64px - 56px);
}
</style>
