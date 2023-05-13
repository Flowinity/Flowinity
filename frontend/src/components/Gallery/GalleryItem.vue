<template>
  <v-card class="d-flex flex-column" :id="'item-' + item.id">
    <WorkspaceDeleteDialog
      title="Delete item?"
      :item="item"
      @submit="deleteItem(item)"
      v-model="deleteItemDialog"
    />
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
      {{ $t("generic.type") }}:
      {{
        item.type === "paste"
          ? "Legacy Paste"
          : String(item.type).charAt(0).toUpperCase() +
            String(item.type).slice(1)
      }}
    </v-card-subtitle>
    <v-card-subtitle>
      {{ $t("generic.originalName") }}: {{ item.originalFilename }}
    </v-card-subtitle>

    <v-card-subtitle>
      {{ $t("generic.uploadedName") }}: {{ item.attachment }}
    </v-card-subtitle>

    <v-card-subtitle>
      {{ $t("generic.createdAt") }}:
      {{ $date(item.createdAt).format("Do of MMMM YYYY, h:mm A") }}
    </v-card-subtitle>
    <v-card-subtitle>{{ $t("generic.size") }}: {{ fileSize }}</v-card-subtitle>
    <slot name="custom-values" :item="item"></slot>
    <div class="ml-4">
      <slot :item="item" name="custom-properties" />
      <v-chip-group class="mb-1">
        <HoverChip
          :text="$t('gallery.collectSelected')"
          icon="mdi-plus"
          @click="$emit('collectivize', item.id)"
          v-if="supports.permissions.write && supports.collections"
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
    </div>
    <v-divider></v-divider>
    <v-card-text class="text-center">
      <slot name="actions" :item="item">
        <!--<HoverChip
          text="Edit & Caption"
          icon="mdi-pencil"
          color="indigo-lighten-1"
          @click="editItem(item)"
          v-if="supports.permissions.write"
          class="my-1"
          aria-label="Edit item"
        ></HoverChip>-->
        <HoverChip
          :text="$t('gallery.actions.delete.text')"
          icon="mdi-delete"
          color="red"
          @click="
            $event.shiftKey ? deleteItem(item) : (deleteItemDialog = true)
          "
          v-if="supports.permissions.write"
          class="my-1"
          :aria-label="$t('gallery.actions.delete.aria')"
        ></HoverChip>
        <HoverChip
          :text="$t('gallery.actions.link.text')"
          icon="mdi-content-copy"
          color="teal"
          @click="
            $functions.copy(
              `https://${$user.user?.domain.domain || 'i.troplo.com'}/i/${
                item.attachment
              }`
            );
            $toast.success('Copied to clipboard!');
          "
          class="my-1"
          :aria-label="$t('gallery.actions.link.aria')"
        ></HoverChip>
        <HoverChip
          :text="$t('gallery.actions.download.text')"
          icon="mdi-download"
          color="primary"
          :href="'https://i.troplo.com/i/' + item.attachment + '?force=true'"
          class="my-1"
          :aria-label="$t('gallery.actions.download.aria')"
        ></HoverChip>
        <HoverChip
          :text="$t('gallery.actions.ocr.text')"
          icon="mdi-ocr"
          color="green"
          @click="
            $functions.copy(item.textMetadata);
            $toast.success('Copied to clipboard!');
          "
          v-if="item.type === 'image'"
          class="my-1"
          :aria-label="$t('gallery.actions.ocr.aria')"
        ></HoverChip>
        <HoverChip
          :text="$t('gallery.actions.star.text')"
          :icon="item.starred ? 'mdi-star' : 'mdi-star-outline'"
          color="amber-darken-2"
          @click="star(item)"
          v-if="$user.user"
          class="my-1"
          :aria-label="$t('gallery.actions.star.aria')"
        ></HoverChip>
        <HoverChip
          :text="$t('gallery.actions.pin.text')"
          :icon="item.item.pinned ? 'mdi-pin' : 'mdi-pin-outline'"
          color="lime"
          @click="pin(item)"
          v-if="$user.user && item.item && supports.pins"
          class="my-1"
          :aria-label="$t('gallery.actions.pin.aria')"
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
import { Collection } from "@/models/collection";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";

export default defineComponent({
  name: "GalleryItem",
  components: { WorkspaceDeleteDialog, HoverChip, GalleryPreview },
  props: ["item", "supports", "selected"],
  data() {
    return {
      deleteItemDialog: false
    };
  },
  computed: {
    fileSize() {
      return this.$functions.fileSize(this.item.fileSize);
    }
  },
  methods: {
    async pin(item: Upload) {
      await this.axios.patch(
        `/collections/${this.item.item.collectionId}/pin/${item.item.id}`
      );
      item.item.pinned = !item.item.pinned;
      this.$emit("refresh", true);
    },
    async star(item: Upload) {
      await this.axios.post("/gallery/star/" + item.attachment);
      item.starred = !item.starred;
    },
    editItem(item: Upload) {
      console.log("Edit item", item);
    },
    async deleteItem(item: Upload) {
      await this.axios.delete("/gallery/" + item.id);
      this.$emit("delete", item);
    },
    async removeItem(item: Upload, collection: Collection) {
      await this.axios.delete(
        `/collections/${collection.id}/remove/${item.id}`
      );
      this.$emit("remove", {
        item,
        collection
      });
    }
  }
});
</script>

<style scoped></style>
