import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import {
  DeleteUploadMutation,
  GalleryQuery
} from "@/graphql/gallery/gallery.graphql";
import { useAppStore } from "@/stores/app.store";
import { useToast } from "vue-toastification";

export const useGalleryStore = defineStore("gallery", () => {
  async function deleteUploads(items: number[]) {
    await useApolloClient().client.mutate({
      mutation: DeleteUploadMutation,
      variables: {
        input: {
          items
        }
      }
    });
    useToast().success("Successfully deleted items.");
  }

  return { deleteUploads };
});
