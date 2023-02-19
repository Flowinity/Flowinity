<template>
  <v-card class="d-flex flex-column" elevation="8" :id="'item-' + item.id">
    <v-toolbar
      style="z-index: 1"
      @click="
        selected.length && supports.multiSelect ? $emit('select', item) : null
      "
      :class="{ unselectable: selected.length }"
    >
      <v-toolbar-title>{{ item.name }}</v-toolbar-title>
      <v-btn
        v-if="!$vuetify.display.mobile && supports.multiSelect"
        icon
        @click.prevent.stop="$emit('select', item)"
      >
        <v-icon>
          {{
            selected.includes(item.id)
              ? "mdi-checkbox-marked-circle"
              : "mdi-circle-outline"
          }}
        </v-icon>
      </v-btn>
    </v-toolbar>
    <GalleryPreview :item="item"></GalleryPreview>
    <v-card-subtitle class="mt-3">
      Type:
      {{
        String(item.type).charAt(0).toUpperCase() + String(item.type).slice(1)
      }}
    </v-card-subtitle>
    <v-card-subtitle>
      Original name: {{ item.originalFilename }}
    </v-card-subtitle>

    <v-card-subtitle>Uploaded name: {{ item.attachment }}</v-card-subtitle>

    <v-card-subtitle>
      Created at:
      {{ $date(item.createdAt).format("Do of MMMM YYYY, h:mm A") }}
    </v-card-subtitle>
    <v-card-subtitle>Size: {{ fileSize }}</v-card-subtitle>
    <div class="ml-4">
      <slot :item="item" name="custom-properties" />
      <v-slide-group>
        <v-chip-group class="mb-1">
          <HoverChip
            text="Add to Collection"
            icon="mdi-plus"
            @click="$emit('collectivize', item.id)"
            v-if="supports.permissions.write"
          ></HoverChip>
          <v-chip
            :to="'/collections/' + collection.id"
            :key="collection.id"
            v-for="collection in item.collections"
            :disabled="!$user.user"
          >
            {{ collection.name }}
            <v-icon
              @click.prevent="removeItem(item, collection)"
              class="ml-1"
              v-if="supports.permissions.write"
            >
              mdi-close
            </v-icon>
          </v-chip>
        </v-chip-group>
      </v-slide-group>
    </div>
    <v-divider></v-divider>
    <v-card-text class="text-center">
      <slot name="actions" :item="item">
        <HoverChip
          text="Edit"
          icon="mdi-pencil"
          color="indigo"
          @click="editItem(item)"
          v-if="supports.permissions.write"
          class="my-1"
        ></HoverChip>
        <HoverChip
          text="Delete"
          icon="mdi-delete"
          color="red"
          @click="deleteItem(item)"
          v-if="supports.permissions.write"
          class="my-1"
        ></HoverChip>
        <HoverChip
          text="Link"
          icon="mdi-content-copy"
          color="teal"
          @click="copyLink(item)"
          class="my-1"
        ></HoverChip>
        <HoverChip
          :text="item.type === 'paste' ? 'Raw' : 'Open'"
          icon="mdi-download"
          color="primary"
          :href="'https://i.troplo.com/i/' + item.attachment + '?force=true'"
          class="my-1"
        ></HoverChip>
        <HoverChip
          text="OCR"
          icon="mdi-ocr"
          color="green"
          @click="$functions.copy(item.textMetadata)"
          v-if="item.type === 'image'"
          class="my-1"
        ></HoverChip>
        <HoverChip
          text="Star"
          :icon="item.starred ? 'mdi-star' : 'mdi-star-outline'"
          color="amber darken-2"
          @click="star(item)"
          v-if="$user.user"
          class="my-1"
        ></HoverChip>
        <HoverChip
          text="Editor"
          icon="mdi-pencil"
          color="indigo"
          v-if="$experiments.experiments['MEME_GEN']"
          class="my-1"
        ></HoverChip>
      </slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import HoverChip from "@/components/Core/HoverChip.vue";
import { Upload } from "@/models/upload";

export default defineComponent({
  name: "GalleryItem",
  components: { HoverChip, GalleryPreview },
  props: ["item", "supports", "selected"],
  computed: {
    fileSize() {
      return this.$functions.fileSize(this.item.fileSize);
    }
  },
  methods: {
    async star(item: Upload) {
      await this.axios.post("/gallery/star/" + item.attachment);
      item.starred = !item.starred;
    },
    copyLink(item: Upload) {
      navigator.clipboard.writeText(
        `https://i.troplo.com/i/${item.attachment}`
      );
    },
    editItem(item: Upload) {
      console.log("Edit item", item);
    },
    deleteItem(item: Upload) {
      console.log("Delete item", item);
    },
    removeItem(item: Upload, collection: any) {
      console.log("Remove item", item, collection);
    }
  }
});
</script>

<style scoped></style>
