import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import { useAppStore } from "@/stores/app.store";

export const useGalleryStore = defineStore("gallery", () => {});
