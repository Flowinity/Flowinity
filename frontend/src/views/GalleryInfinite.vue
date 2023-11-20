<template>
  <v-container>
    <GalleryNavigation
      :supports="
        supports || {
          filter: true,
          metadata: true,
          search: true,
          upload: true,
          sort: true
        }
      "
      @refreshGallery="getGallery(undefined, true)"
      @update:show="show = $event"
      v-model:search="show.search"
      @update:filter="
        show.selected = $event;
        page = 1;
      "
      @update:metadata="
        show.metadata = $event;
        page = 1;
      "
      @update:sort="
        show.sort = $event;
        page = 1;
      "
      @update:order="
        show.order = $event;
        page = 1;
      "
    />
    <GalleryCoreInfinite
      :items="gallery"
      :page="page"
      :loading="loading"
      :path="path"
      :random-attachment-loading="randomLoading"
      :show="show"
      :supports="
        supports || {
          multiSelect: true,
          randomAttachment: true,
          permissions: {
            read: true,
            write: true,
            configure: true
          }
        }
      "
      @delete="deleteItem"
      @refresh="getGallery()"
      @remove="removeItemFromCollection($event.item, $event.collection)"
      @updateItem="updateItem"
      @page-change="$router.push(`${path}/${$event}`)"
      @random-attachment="randomAttachment"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </GalleryCoreInfinite>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { CollectionCache } from "@/types/collection";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import {
  GalleryFilter,
  GalleryInput,
  GalleryOrder,
  GallerySort,
  GalleryType,
  Pager,
  Upload
} from "@/gql/graphql";
import { isNumeric } from "@/plugins/isNumeric";
import { StateHandler } from "@/components/Scroll/types";
import GalleryCoreInfinite from "@/components/Gallery/GalleryCoreInfinite.vue";

export default defineComponent({
  name: "PersonalGallery",
  components: { GalleryCoreInfinite, GalleryNavigation, GalleryCore },
  props: ["path", "type", "name", "random", "supports", "id"],
  data() {
    return {
      gallery: undefined as
        | {
            items: Upload[];
            pager: Pager;
          }
        | undefined,
      page: 1,
      loading: true,
      show: {
        search: "",
        metadata: true,
        selected: [GalleryFilter.All],
        sort: GallerySort.CreatedAt,
        order: GalleryOrder.Desc
      },
      randomLoading: false
    };
  },
  computed: {
    rid() {
      return this.$route.params.id;
    }
  },
  methods: {
    async randomAttachment() {
      this.randomLoading = true;
      // TODO
      /*this.$functions.copy(
        "https://" + this.$user.user?.domain.domain + "/i/" + data.attachment
      );*/
      this.randomLoading = false;
    },
    removeItemFromCollection(item: Upload, collection: CollectionCache) {
      const index = this.gallery.items.findIndex(
        (i: Upload) => i.id === item.id
      );
      if (index === -1) return;
      this.gallery.items[index] = <Upload>{
        ...this.gallery.items[index],
        collections: this.gallery.items[index]?.collections.filter(
          (c: any) => c.id !== collection.id
        )
      };
    },
    deleteItem(item: Upload) {
      const index = this.gallery.items.findIndex((i: any) => i.id === item.id);
      if (index === -1) return;
      this.gallery.items.splice(index, 1);
    },
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      const index = this.gallery.items.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.items[index] = {
        ...this.gallery.items[index],
        collections: [...this.gallery.items[index]?.collections, collection]
      };
    },
    async getGallery(
      input?: { state: StateHandler; page: number },
      reset: boolean = false
    ) {
      this.loading = true;
      if (input) {
        input.state.loading();
        this.page++;
      }
      const {
        data: { gallery }
      } = await this.$apollo.query({
        query: GalleryQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {
            page: this.page,
            filters: this.show.selected,
            search: this.show.search,
            sort: this.show.sort,
            type: this.type,
            order: this.show.order,
            collectionId: isNumeric(this.rid) ? parseInt(this.rid) : undefined,
            shareLink: isNumeric(this.rid) ? undefined : this.rid,
            limit: 12
          }
        } as GalleryInput
      });
      if (this.gallery && !reset) {
        this.gallery = {
          items: [...this.gallery.items, ...gallery.items],
          pager: gallery.pager
        };
      } else {
        this.gallery = gallery;
        this.$route.params.page = 1;
      }
      if (!gallery.items.length && input) {
        input.state.complete();
      } else if (input) {
        input.state.loaded();
      }

      this.loading = false;
      return gallery;
    },
    socketRegister(
      uploads:
        | { upload: Upload; url: string }
        | { upload: Upload; url: string }[]
    ) {
      if (this.page !== 1) return;
      if (Array.isArray(uploads)) {
        for (const upload of uploads) {
          this.gallery.items.unshift(upload.upload);
        }
      } else {
        this.gallery.items.unshift(uploads.upload);
      }
    },
    init() {
      this.$socket.off("gallery/create", this.socketRegister);
      this.$app.title = this.name || "Gallery";
      this.page = parseInt(<string>this.$route.params.page) || 1;
      this.getGallery();
      if (this.type === GalleryType.Personal) {
        this.$sockets.gallery.on("create", this.socketRegister);
      }
    }
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.type === GalleryType.Personal) {
      this.$socket.off("gallery/create", this.socketRegister);
    }
  },
  watch: {
    "$route.params.page"(page) {
      if (!page) return;
      this.page = parseInt(page) || 1;
      this.getGallery();
    },
    endpoint() {
      this.init();
    },
    "show.selected"() {
      if (
        this.show.selected.includes(GalleryFilter.All) &&
        this.show.selected.length > 1
      ) {
        this.show.selected.splice(
          this.show.selected.indexOf(GalleryFilter.All),
          1
        );
      }
    },
    type() {
      this.getGallery(undefined, true);
    }
  }
});
</script>
