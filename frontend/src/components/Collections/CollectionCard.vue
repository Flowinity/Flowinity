<template>
  <v-card
    v-if="item"
    :to="
      type === 'collection'
        ? '/collections/' + item.id
        : '/autoCollect/' + item.id
    "
    class="rounded-xl d-flex flex-column"
    elevation="8"
    style="cursor: pointer"
  >
    <div class="image-container">
      <v-row
        align="center"
        class="fill-height ma-0"
        justify="center"
        v-if="loading"
      >
        <v-progress-circular color="grey lighten-5" indeterminate />
      </v-row>
      <img
        :src="collectionImage"
        @load="loading = false"
        :alt="item.name"
        class="cover-image"
      />
      <div>
        <div class="overlay">
          <div class="text-overlay">
            <v-card-title>
              {{ item.name }}
              <small v-if="type === 'collection'" class="float-end">
                {{ item.itemCount }} items
              </small>
              <small v-if="type === 'autoCollect'" class="float-end">
                {{ item.autoCollectApprovals?.length }} pending approvals
              </small>
            </v-card-title>
            <v-card-text v-if="!item.shared" class="mt-n2">
              <v-icon v-if="item.shareLink">mdi-link-variant</v-icon>
              <template v-if="!item.users?.length && item.shareLink">
                ShareLink
              </template>
              <template v-if="item.users?.length">
                <v-icon>mdi-swap-horizontal</v-icon>
                Shared with {{ item.users.length }} others.
              </template>
            </v-card-text>
            <v-card-text v-if="item.shared && item.user" class="mt-n2">
              <v-icon v-if="item.shareLink">mdi-link-variant</v-icon>
              <v-icon>mdi-swap-horizontal</v-icon>
              Shared with me by {{ item.user.username }}
              <v-chip
                v-if="item.recipient.write"
                size="x-small"
                variant="outlined"
              >
                WRITE
              </v-chip>
              <v-chip
                v-if="item.recipient.configure"
                class="ml-1"
                size="x-small"
                variant="outlined"
              >
                CONFIGURE
              </v-chip>
            </v-card-text>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CollectionCache } from "@/types/collection";

export default defineComponent({
  name: "CollectionCard",
  props: {
    type: {
      type: String as () => "collection" | "autoCollect",
      required: false,
      default: "collection"
    },
    item: {
      type: Object as () => CollectionCache,
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    collectionImage(): string {
      if (this.item?.banner) {
        return this.$app.domain + this.item.banner;
      } else if (this.item?.image) {
        return this.$app.domain + this.item.image;
      } else if (this.item?.preview?.attachment) {
        return this.$app.domain + this.item.preview.attachment.attachment;
      } else {
        return "https://i.troplo.com/i/a050d6f271c3.png";
      }
    }
  }
});
</script>

<style scoped>
.image-container {
  position: relative;
  height: 200px;
  width: 100%;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgb(0, 0, 0));
}

.text-overlay {
  position: absolute;
  color: white;
  bottom: 0;
  left: 0;
  width: 100%;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  object-fit: cover;
  object-position: center;
}
</style>
