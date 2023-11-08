<template>
  <Sharing
    v-if="collection"
    v-model="sharing"
    :collection="collection"
    @get-collection="getCollection"
  ></Sharing>
  <CollectionSettings
    v-model="settings"
    :collection="collection"
    @refreshCollection="getCollection"
  ></CollectionSettings>
  <UserBanner
    v-if="collection"
    :collection="collection"
    :gold="$user.gold"
    @sharing-dialog="sharing = true"
    @refresh-user="getCollection"
  >
    <v-card-title>
      {{ collection.name }}
      <span class="float-end">
        <v-btn
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
          @click="sharing = true"
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-share</v-icon>
          Collection Sharing
        </v-btn>
        <v-btn
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
          @click="settings = true"
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-cog</v-icon>
          Settings
        </v-btn>
        <v-btn
          v-else-if="collection?.shareLink"
          @click="
            $functions.copy(
              $app.site.hostnameWithProtocol +
                '/collections/' +
                collection?.shareLink
            )
          "
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-link</v-icon>
          Copy Share Link
        </v-btn>
      </span>
    </v-card-title>
    <v-card-text v-if="collection.users.length" class="mt-n3">
      <v-icon>mdi-swap-horizontal</v-icon>
      {{ collection.user.username }},
      {{ collection.users.map((user) => user.user.username).join(", ") }}
    </v-card-text>
    <v-card-text v-else class="mt-n3">{{ collection.items }} items</v-card-text>
  </UserBanner>
  <v-container v-if="collection">
    <PersonalGallery
      :type="GalleryType.Collection"
      :id="collection.id"
      :supports="{
        multiSelect: true,
        pins: true,
        randomAttachment: true,
        upload: false,
        search: true,
        metadata: true,
        filter: true,
        sort: true,
        permissions: {
          read: true,
          write: collection.permissionsMetadata?.write,
          configure: collection.permissionsMetadata?.configure
        }
      }"
      :path="`/collections/${this.$route.params.id}`"
    >
      <template v-slot:custom-values="{ item }">
        <v-card-subtitle>Creator: {{ item?.user?.username }}</v-card-subtitle>
      </template>
    </PersonalGallery>
  </v-container>
  <v-container v-else-if="!$app.componentLoading">
    <PromoNoContent
      icon="mdi-close-circle"
      title="Collection not found"
      description="The collection you are looking for does not exist or you don't have permission to view it."
    ></PromoNoContent>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import { CollectionCache } from "@/types/collection";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import Sharing from "@/components/Collections/Dialogs/Sharing.vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import CollectionSettings from "@/components/Collections/Dialogs/Settings.vue";
import PersonalGallery from "@/views/Gallery.vue";
import { GalleryType } from "@/gql/graphql";
import { Collection } from "@/models/collection";
import { isNumeric } from "@/plugins/isNumeric";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";

export default defineComponent({
  name: "CollectionsItem",
  computed: {
    GalleryType() {
      return GalleryType;
    }
  },
  components: {
    PromoNoContent,
    PersonalGallery,
    CollectionSettings,
    UserBanner,
    Sharing,
    GalleryCore,
    CollectionBanner,
    GalleryNavigation
  },
  data() {
    return {
      collection: undefined as CollectionCache | undefined,
      sharing: false,
      settings: false
    };
  },
  methods: {
    async getCollection(load = true) {
      if (!this.collection && this.$collections.items.length && load) {
        this.collection = this.$collections.items.find(
          (c: Collection) => c.id === parseInt(<string>this.$route.params.id)
        );
      }
      if (load) {
        this.$app.componentLoading = true;
      }
      const collection = await this.$collections.getCollection(
        isNumeric(this.$route.params.id)
          ? parseInt(<string>this.$route.params.id)
          : this.$route.params.id
      );
      this.$app.componentLoading = false;
      this.collection = collection;
      this.$app.title = this.collection?.name || "Collection";
    },
    async onCollectionUserUpdate(data: { id?: number; collectionId: number }) {
      if (data.collectionId !== this.collection?.id) return;
      console.log(1);
      this.getCollection(false);
    },
    async onCollectionUpdate(data: { id?: number; name?: string }) {
      if (data.id !== this.collection?.id) return;
      this.getCollection(false);
    }
  },
  mounted() {
    this.getCollection();
    this.$sockets.gallery.on("collectionUpdate", this.onCollectionUpdate);
    this.$sockets.gallery.on(
      "collectionUserUpdate",
      this.onCollectionUserUpdate
    );
    this.$sockets.gallery.on("collectionUserAdd", this.onCollectionUserUpdate);
    this.$sockets.gallery.on(
      "collectionUserRemove",
      this.onCollectionUserUpdate
    );
  },
  unmounted() {
    this.$sockets.gallery.off("collectionUpdate", this.onCollectionUpdate);
    this.$sockets.gallery.off(
      "collectionUserUpdate",
      this.onCollectionUserUpdate
    );
    this.$sockets.gallery.off("collectionUserAdd", this.onCollectionUserUpdate);
    this.$sockets.gallery.off(
      "collectionUserRemove",
      this.onCollectionUserUpdate
    );
  },
  watch: {
    "$route.params.id"(val) {
      if (!val) return;
      this.getCollection();
    }
  }
});
</script>
