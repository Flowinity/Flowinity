<template>
  <Sharing
    v-model="sharing"
    :collection="collection"
    @get-collection="getCollection"
    @collection-users-push="collection?.users?.push($event)"
    v-if="collection"
  ></Sharing>
  <CollectionSettings
    v-model="settings"
    :collection="collection"
    @refreshCollection="getCollection"
  ></CollectionSettings>
  <UserBanner
    :collection="collection"
    @sharing-dialog="sharing = true"
    v-if="collection"
    @refresh-user="getCollection"
    :gold="$user.gold"
  >
    <v-card-title>
      {{ collection.name }}
      <span class="float-end">
        <v-btn
          @click="sharing = true"
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
        >
          <v-icon style="font-size: 20px" class="mr-1">mdi-share</v-icon>
          Collection Sharing
        </v-btn>
        <v-btn
          @click="settings = true"
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
        >
          <v-icon style="font-size: 20px" class="mr-1">mdi-cog</v-icon>
          Settings
        </v-btn>
        <v-btn
          v-else-if="collection?.shareLink"
          @click="
            $functions.copy(
              $app.site.hostnameWithProtocol +
                '/collections/share/' +
                collection?.shareLink
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
      {{ collection.users.map((user) => user.user.username).join(", ") }}
    </v-card-text>
    <v-card-text class="mt-n3" v-else>{{ collection.items }} items</v-card-text>
  </UserBanner>
  <v-container v-if="collection">
    <GalleryNavigation
      @update:show="show = $event"
      @update:search="
        show.search = $event;
        page = 1;
      "
      @refreshGallery="getGallery()"
      @update:filter="
        show.selected = $event;
        page = 1;
      "
      @update:metadata="
        show.metadata = $event;
        page = 1;
      "
      class="mt-1 ml-1"
      @update:sort="
        show.sort = $event;
        page = 1;
      "
      :supports="{
        filter: true,
        metadata: true,
        search: true,
        upload: false,
        sort: false
      }"
    ></GalleryNavigation>
    <GalleryCore
      :page="page"
      :items="gallery"
      :supports="{
        multiSelect: true,
        pins: true,
        randomAttachment: true,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
      @refresh="getGallery($event)"
      @pageChange="$router.push(`/collections/${$route.params.id}/${$event}`)"
      @updateItem="updateItem"
      @remove="removeItemFromCollection($event.item, $event.collection)"
      @random-attachment="randomAttachment"
      :random-attachment-loading="randomLoading"
    >
      <template v-slot:custom-values="{ item }">
        <v-card-subtitle>Creator: {{ item?.user?.username }}</v-card-subtitle>
      </template>
    </GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import { Upload } from "@/models/upload";
import { CollectionCache } from "@/types/collection";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import Sharing from "@/components/Collections/Dialogs/Sharing.vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import CollectionSettings from "@/components/Collections/Dialogs/Settings.vue";

export default defineComponent({
  name: "CollectionsItem",
  components: {
    CollectionSettings,
    UserBanner,
    Sharing,
    GalleryCore,
    CollectionBanner,
    GalleryNavigation
  },
  data() {
    return {
      randomLoading: false,
      collection: undefined as CollectionCache | undefined,
      gallery: {
        gallery: [] as Upload[]
      },
      page: 1,
      show: {
        search: "",
        metadata: true,
        selected: "all",
        sort: "newest"
      },
      sharing: false,
      settings: false
    };
  },
  methods: {
    async randomAttachment() {
      this.randomLoading = true;
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}/random`
      );
      this.$functions.copy(
        "https://" + this.$user.user?.domain.domain + "/i/" + data.attachment
      );
      this.randomLoading = false;
    },
    removeItemFromCollection(item: Upload, collection: CollectionCache) {
      const index = this.gallery.gallery.findIndex(
        (i: Upload) => i.id === item.id
      );
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: this.gallery.gallery[index]?.collections.filter(
          (c: any) => c.id !== collection.id
        )
      };
    },
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      console.log(item, collection);
      const index = this.gallery.gallery.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [...this.gallery.gallery[index]?.collections, collection]
      };
    },
    async getGallery(noLoad = false) {
      if (!noLoad) {
        this.$app.componentLoading = true;
      }
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}/gallery`,
        {
          params: {
            page: this.page,
            search: this.show.search,
            textMetadata: this.show.metadata,
            filter: this.show.selected,
            sort: this.show.sort
          }
        }
      );
      this.gallery = data;
      this.$app.componentLoading = false;
    },
    async getCollection() {
      if (!this.collection && this.$collections.items.length) {
        this.collection = this.$collections.items.find(
          (c: any) => c.id === parseInt(<string>this.$route.params.id)
        );
      }
      this.$app.componentLoading = true;
      const { data } = await this.axios.get(
        `/collections/${this.$route.params.id}`
      );
      this.$app.componentLoading = false;
      this.collection = data;
      this.$app.title = this.collection?.name as string;
    }
  },
  mounted() {
    this.$app.title = "Collection";
    this.page = parseInt(<string>this.$route.params.page) || 1;
    this.getCollection();
    this.getGallery();
  },
  watch: {
    "$route.params.page"(val) {
      if (!val) return;
      this.page = parseInt(<string>val) || 1;
      this.getGallery();
    },
    "$route.params.id"(val) {
      if (!val) return;
      this.getCollection();
      this.getGallery();
    }
  }
});
</script>

<style scoped></style>
