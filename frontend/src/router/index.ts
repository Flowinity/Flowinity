// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("@/views/Home.vue")
      },
      {
        path: "/dashboard",
        name: "Dashboard Redirect",
        redirect: "/"
      },
      {
        path: "/gallery",
        name: "Personal Gallery",
        component: () => import("@/views/Gallery.vue"),
        children: [
          {
            path: ":page",
            name: "Personal Gallery Page",
            component: () => import("@/views/Gallery.vue")
          }
        ]
      },
      {
        path: "/collections",
        name: "Collections",
        component: () => import("@/views/Collections/Home.vue"),
        children: [
          {
            path: ":id",
            name: "Collection",
            component: () => import("@/views/Collections/Item.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/",
    component: () => import("@/layouts/unauth/Unauth.vue"),
    children: [
      {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Auth/Login.vue")
      },
      {
        path: "/register/:key?",
        name: "Register",
        component: () => import("@/views/Auth/Register.vue")
      },
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Auth/Home.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from) => {
  const user = useUserStore();
  if (
    !user.user &&
    !["Login", "Home", "Register"].includes(to.name as string)
  ) {
    console.log("Redirecting to login");
    return { name: "Home" };
  }
});

export default router;
