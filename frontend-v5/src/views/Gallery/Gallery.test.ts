import { mount } from "@vue/test-utils";
import Gallery from "@/views/Gallery/Gallery.vue";
import { nextTick } from "vue";
import { GalleryFilter, GalleryOrder, GallerySort } from "@/gql/graphql";
import { describe, beforeEach, expect, it, vi } from "vitest";
import { useAppStore } from "@/stores/app.store";
import { createPinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import apolloBoot from "@/boot/apollo";
import { ApolloClient } from "@apollo/client/core";

describe("Gallery.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    let apollo: ApolloClient<any> | null = null;
    const app = {
      config: {
        globalProperties: {
          $apollo: null
        }
      },
      use(plugin: any) {
        apollo = plugin;
      },
      provide(key: any, value: any) {}
    };
    wrapper = mount(Gallery, {
      global: {
        plugins: [createTestingPinia(), apolloBoot(app)],
        mocks: {
          appStore: useAppStore()
        }
      }
    });
  });

  it("should initialize with correct default data", async () => {
    expect(wrapper.vm.page.value).toBe(1);
    expect(wrapper.vm.loading.value).toBe(false);
    expect(wrapper.vm.items.value).toEqual([]);
    expect(wrapper.vm.selected.value).toEqual([]);
    expect(wrapper.vm.search.value).toBe("");
    expect(wrapper.vm.filter.value).toEqual([GalleryFilter.IncludeMetadata]);
    expect(wrapper.vm.sort.value).toBe(GallerySort.CreatedAt);
    expect(wrapper.vm.order.value).toBe(GalleryOrder.Desc);
  });

  it("should select an upload when select function is called", async () => {
    const upload = { id: 1 };
    wrapper.vm.select(upload);
    await nextTick();
    expect(wrapper.vm.selected.value).toEqual([upload]);
  });

  it("should deselect an upload when select function is called twice with the same upload", async () => {
    const upload = { id: 1 };
    wrapper.vm.select(upload);
    wrapper.vm.select(upload);
    await nextTick();
    expect(wrapper.vm.selected.value).toEqual([]);
  });

  it("should add to collection when pushCollection function is called", async () => {
    const collection = { id: 1 };
    const upload = { id: 1, collections: [] };
    wrapper.vm.items.value = [upload];
    wrapper.vm.pushCollection({
      collectionId: collection.id,
      items: [upload.id]
    });
    await nextTick();
    expect(wrapper.vm.items.value[0].collections).toEqual([collection]);
  });

  it("should not add to collection when pushCollection function is called with non-existing collection", async () => {
    const collection = { id: 1 };
    const upload = { id: 1, collections: [] };
    wrapper.vm.items.value = [upload];
    wrapper.vm.pushCollection({ collectionId: 2, items: [upload.id] });
    await nextTick();
    expect(wrapper.vm.items.value[0].collections).toEqual([]);
  });

  it("should update gallery when getGallery function is called", async () => {
    const gallery = {
      items: [{ id: 1 }],
      pager: { totalPages: 1, totalItems: 1 }
    };
    wrapper.vm.getGallery = vi.fn().mockResolvedValue(gallery);
    await wrapper.vm.getGallery();
    expect(wrapper.vm.items.value).toEqual(gallery.items);
    expect(wrapper.vm.pager.value).toEqual(gallery.pager);
    expect(wrapper.vm.loading.value).toBe(false);
  });

  it("should handle error when getGallery function is called and fails", async () => {
    wrapper.vm.getGallery = vi.fn().mockRejectedValue(new Error("Error"));
    await wrapper.vm.getGallery();
    expect(wrapper.vm.loading.value).toBe(false);
  });
});
