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
    <v-img
      :src="collectionImage"
      class="white--text align-end"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)"
      height="200px"
    >
      <template v-slot:placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </template>
      <v-card-title>
        {{ item.name }}
        <small v-if="type === 'collection'" class="float-end">
          {{ item.items }} items
        </small>
        <small v-if="type === 'autoCollect'" class="float-end">
          {{ item.autoCollectApprovals.length }} pending approvals
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
        <v-chip v-if="item.recipient.write" size="x-small" variant="outlined">
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
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CollectionCard",
  props: {
    type: {
      type: String as () => "collection" | "autoCollect",
      required: false,
      default: "collection"
    },
    item: {
      type: Object as () => any,
      required: true
    }
  },
  computed: {
    collectionImage(): string {
      if (this.item?.image) {
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

<style scoped></style>
