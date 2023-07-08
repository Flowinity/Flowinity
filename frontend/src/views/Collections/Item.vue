<template>
  <Sharing
    v-if="collection"
    v-model="sharing"
    :collection="collection"
    @get-collection="getCollection"
    @collection-users-push="collection?.users?.push($event)"
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
                '/collections/share/' +
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
      :endpoint="`/collections/${$route.params.id || collection.id}/gallery`"
      :name="`${collection.name} Collection`"
      :path="`/collections/${$route.params.id || collection.id}`"
      :random="`/collections/${$route.params.id || collection.id}/random`"
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
    >
      <template v-slot:custom-values="{ item }">
        <v-card-subtitle>Creator: {{ item?.user?.username }}</v-card-subtitle>
      </template>
    </PersonalGallery>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import {CollectionCache} from "@/types/collection";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import Sharing from "@/components/Collections/Dialogs/Sharing.vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import CollectionSettings from "@/components/Collections/Dialogs/Settings.vue";
import PersonalGallery from "@/views/Gallery.vue";

export default defineComponent({
  name: "CollectionsItem",
  components: {
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
    async getCollection() {
      if (!this.collection && this.$collections.items.length) {
        this.collection = this.$collections.items.find(
          (c: any) => c.id === parseInt(<string>this.$route.params.id)
        );
      }
      this.$app.componentLoading = true;
      const {data} = await this.axios.get(
        `/collections/${this.$route.params.id}`
      );
      this.$app.componentLoading = false;
      this.collection = data;
      this.$app.title = this.collection?.name as string;
    }
  },
  mounted() {
    this.getCollection();
  },
  watch: {
    "$route.params.id"(val) {
      if (!val) return;
      this.getCollection();
    }
  }
});
</script>

<style scoped></style>
