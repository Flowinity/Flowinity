import { createRouter, createWebHistory } from "vue-router";
import { GalleryType } from "@/gql/graphql";
import { useUserStore } from "@/stores/user.store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue")
    },
    {
      path: "/gallery",
      name: "My Files",
      component: () => import("@/views/Gallery/Gallery.vue"),
      props: {
        type: GalleryType.Personal
      }
    },
    {
      path: "/starred",
      name: "Starred",
      component: () => import("@/views/Gallery/Gallery.vue"),
      props: {
        type: GalleryType.Starred,
        name: "Starred",
        path: "/starred"
      }
    },
    {
      path: "/collections/:id",
      name: "Collection",
      component: () => import("@/views/Gallery/Collection.vue")
    },
    {
      path: "/auto-collects/:id",
      name: "AutoCollect",
      component: () => import("@/views/Gallery/AutoCollectsGallery.vue")
    },
    {
      path: "/auto-collects",
      name: "AutoCollects",
      component: () => import("@/views/AutoCollects/AutoCollects.vue")
    },
    {
      path: "/autoCollects",
      redirect: "/auto-collects"
    },
    {
      path: "/communications/:id",
      name: "Chat",
      component: () => import("@/views/Chats/Chat.vue")
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("@/views/Settings/SettingsMain.vue"),
      children: [
        {
          path: "/settings/account",
          name: "Account Settings",
          component: () => import("@/views/Settings/SettingsAccount.vue")
        },
        {
          path: "/settings/setup",
          name: "Client Setup",
          component: () => import("@/views/Settings/SettingsSetup.vue")
        },
        {
          path: "/settings/about",
          name: "About Flowinity",
          component: () => import("@/views/Settings/SettingsAbout.vue")
        },
        {
          path: "/settings/security",
          name: "Account Security",
          component: () => import("@/views/Settings/SettingsSecurity.vue")
        },
        {
          path: "/settings/domains",
          name: "Account Domain",
          component: () => import("@/views/Settings/SettingsDomains.vue")
        },
        {
          path: "/settings/privacy",
          name: "Account Privacy",
          component: () => import("@/views/Settings/SettingsPrivacy.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/Register.vue")
    }
  ]
});

router.beforeEach(async (to, from) => {
  const user = useUserStore();
  const u = user.user || localStorage.getItem("userStore");
  if (
    !u &&
    ![
      "Login",
      "Register",
      "404",
      "Collection Item",
      "Content Policy",
      "Slideshow",
      "Password Reset",
      "Email Verify",
      "Workspace Item",
      "Note",
      "Notes Workspaces Redirect",
      "Privacy Policy",
      "Attachment Item",
      "Credits",
      "TPU Setup Wizard",
      "User",
      "OAuth",
      "Join Chat"
    ].includes(to.name as string)
  ) {
    console.log("Redirecting to login");
    return { name: "Login" };
  } else if (u && ["Login", "Register"].includes(to.name as string)) {
    console.log("Redirecting to dashboard");
    return { name: "Home" };
  }
});

export default router;
