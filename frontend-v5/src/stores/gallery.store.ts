import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { DeleteUploadMutation } from "@/graphql/gallery/gallery.graphql";
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
