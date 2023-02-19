<template>
  <v-card class="rounded-xl d-flex flex-column mb-2" elevation="8">
    <v-img
      :src="collectionImage"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)"
      height="200px"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
      <v-card-title>
        {{ collection.name }}
        <span class="float-end">
          <v-btn
            text
            @click="$emit('sharingDialog', true)"
            v-if="
              !$route.params.type && collection.permissionsMetadata.configure
            "
          >
            <v-icon style="font-size: 20px" class="mr-1">mdi-share</v-icon>
            Collection Sharing
          </v-btn>
          <v-btn
            @click="$emit('settingsDialog', true)"
            text
            v-if="
              !$route.params.type && collection.permissionsMetadata.configure
            "
          >
            <v-icon style="font-size: 20px" class="mr-1">mdi-cog</v-icon>
            Settings
          </v-btn>
          <v-btn
            v-else-if="collection.shareLink"
            text
            @click="
              $functions.copy(
                $app.site.hostnameWithProtocol +
                  '/collections/share/' +
                  collection.shareLink
              )
            "
          >
            <v-icon style="font-size: 20px" class="mr-1">mdi-link</v-icon>
            Copy Share Link
          </v-btn>
        </span>
      </v-card-title>
      <v-card-text class="mt-n3" v-if="collection.users.length">
        <v-icon>mdi-swap-horizontal</v-icon>
        {{ collection.user.username }},
        {{
          collection.users
            .map((user: CollectionCache) => user.user.username)
            .join(", ")
        }}
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CollectionCache } from "@/types/collection";

export default defineComponent({
  name: "CollectionBanner",
  props: {
    collection: {
      type: Object as () => CollectionCache,
      required: true
    }
  },
  computed: {
    collectionImage(): string {
      if (this.collection?.image) {
        return this.$app.domain + this.collection.image;
      } else if (this.collection?.preview?.attachment?.attachment) {
        return this.$app.domain + this.collection.preview.attachment.attachment;
      } else {
        return "https://i.troplo.com/i/a050d6f271c3.png";
      }
    }
  }
});
</script>

<style scoped></style>
