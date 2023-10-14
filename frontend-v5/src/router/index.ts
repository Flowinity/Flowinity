import { createRouter, createWebHistory } from "vue-router";
import { GalleryType } from "@/gql/graphql";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue")
    },
    {
      path: "/gallery",
      name: "My Files",
      component: () => import("@/views/Gallery/Gallery.vue"),
      props: {
        type: GalleryType.Personal
      }
    }
  ]
});

export default router;
