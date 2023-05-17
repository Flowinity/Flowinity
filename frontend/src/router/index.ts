// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/communications",
        name: "Communications",
        component: () => import("@/layouts/colubrina/Colubrina.vue"),
        redirect: "/communications/home",
        children: [
          {
            path: "home",
            name: "Communications Home",
            component: () => import("@/views/Communications/Home.vue")
          },
          {
            path: ":chatId",
            name: "Communication",
            component: () => import("@/views/Communications/Chat.vue")
          }
        ]
      },
      {
        path: "/mail",
        name: "Mail",
        component: () => import("@/layouts/mail/Mail.vue"),
        redirect: "/mail/home",
        children: [
          {
            path: ":mailbox",
            name: "Mailbox",
            component: () => import("@/views/Mail/Mailbox.vue"),
            children: [
              {
                path: ":messageId",
                name: "Message",
                component: () => import("@/views/Mail/Message.vue")
              }
            ]
          },
          {
            path: "home",
            name: "Mail Home",
            component: () => import("@/views/Mail/Home.vue")
          }
        ]
      },
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
        path: "/gallery/:page?",
        name: "Personal Gallery",
        component: () => import("@/views/Gallery.vue"),
        props: {
          endpoint: "/gallery",
          path: "/gallery",
          name: "Gallery"
        }
      },
      {
        path: "/collections",
        name: "Collections",
        component: () => import("@/views/Collections/Home.vue")
      },
      {
        path: "/collections/:id/:page?",
        name: "Collection Item",
        component: () => import("@/views/Collections/Item.vue")
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/Settings/Settings.vue"),
        redirect: "/settings/dashboard",
        children: [
          {
            path: "dashboard",
            name: "Dashboard Settings",
            component: () => import("@/views/Settings/Home.vue")
          },
          {
            path: "security",
            name: "Security",
            component: () => import("@/views/Settings/Security.vue")
          },
          {
            path: "clients",
            name: "Setup",
            component: () => import("@/views/Settings/Setup.vue")
          },
          {
            path: "about",
            name: "About",
            component: () => import("@/views/Settings/About.vue")
          },
          {
            path: "domains",
            name: "Domains",
            component: () => import("@/views/Settings/Domains.vue")
          },
          {
            path: "slideshows",
            name: "Slideshows",
            component: () => import("@/views/Settings/Slideshows.vue")
          },
          {
            path: "integrations",
            name: "Integrations",
            component: () => import("@/views/Settings/Integrations.vue")
          },
          {
            path: "integrations/link/:provider",
            name: "Link Integration",
            component: () => import("@/views/Settings/IntegrationsLink.vue")
          }
        ]
      },
      {
        path: "/autoCollect",
        name: "AutoCollects",
        component: () => import("@/views/AutoCollects/Home.vue")
      },
      {
        path: "/autoCollect/configure",
        name: "AutoCollects Configure",
        component: () => import("@/views/AutoCollects/Configure.vue")
      },
      {
        path: "/autoCollect/:id",
        name: "AutoCollect",
        component: () => import("@/views/AutoCollects/Item.vue")
      },
      {
        path: "/notes",
        name: "Notes Workspaces Redirect",
        redirect: "/workspaces"
      },
      {
        path: "/notes/:id",
        name: "Note",
        redirect: (to: any) => `/workspaces/notes/${to.params.id}`
      },
      {
        path: "/workspaces",
        name: "Workspaces",
        component: () => import("@/views/Workspaces/Home.vue")
      },
      {
        path: "/workspaces/notes/:id/:version?",
        name: "Workspace Item",
        component: () => import("@/views/Workspaces/Item.vue")
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/views/User/Home.vue")
      },
      {
        path: "/u/:username",
        name: "User",
        component: () => import("@/views/User/User.vue")
      },
      {
        path: "/starred/:page?",
        name: "Starred",
        component: () => import("@/views/Gallery.vue"),
        props: {
          endpoint: "/gallery/starred",
          path: "/starred",
          name: "Starred"
        }
      },
      {
        path: "/slideshow/:code",
        name: "Slideshow",
        component: () => import("@/views/Slideshow.vue")
      },
      {
        path: "/admin",
        name: "Admin",
        redirect: "/admin/dashboard",
        component: () => import("@/views/Admin/Admin.vue"),
        children: [
          {
            path: "dashboard",
            name: "Admin Dashboard",
            component: () => import("@/views/Admin/Dashboard.vue")
          },
          {
            path: "services",
            name: "Admin Services",
            component: () => import("@/views/Admin/Services.vue")
          },
          {
            path: "dev",
            name: "Admin Developer Options",
            component: () => import("@/views/Admin/Dev.vue")
          },
          {
            path: "users",
            name: "Admin Users",
            component: () => import("@/views/Admin/Users.vue")
          },
          {
            path: "cache",
            name: "Admin Cache",
            component: () => import("@/views/Admin/Cache.vue")
          },
          {
            path: "badges",
            name: "Admin Badges",
            component: () => import("@/views/Admin/Badges.vue")
          },
          {
            path: "autoCollect",
            name: "Admin AutoCollects",
            component: () => import("@/views/Admin/AutoCollect.vue")
          },
          {
            path: "ip",
            name: "Admin Whitelist",
            component: () => import("@/views/Admin/Whitelist.vue")
          },
          {
            path: "communications",
            name: "Admin Communications",
            component: () => import("@/views/Admin/Communications.vue")
          },
          {
            path: "domains",
            name: "Admin Domains",
            component: () => import("@/views/Admin/Domains.vue")
          }
        ]
      },
      {
        path: "/insights",
        name: "Insights",
        component: () => import("@/views/Insights/Home.vue")
      },
      {
        path: "/insights/:type/:username?",
        name: "Weekly Insights",
        component: () => import("@/views/Insights/Weekly.vue")
      },
      {
        path: "/changeLog",
        name: "Changelog",
        component: () => import("@/views/Changelog.vue")
      },
      // Unauthenticated
      {
        path: "/verify/:token",
        name: "Email Verify",
        component: () => import("@/views/Auth/EmailVerify.vue")
      },
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
        path: "/invite/:key?",
        name: "Invite",
        redirect: (to: any) => `/register/${to.params.key}`
      },
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Auth/Home.vue")
      },
      {
        path: "/passwordReset/:code",
        name: "Password Reset",
        component: () => import("@/views/Auth/PasswordReset.vue")
      },
      {
        path: "/policies/content",
        name: "Content Policy",
        component: () => import("@/views/Policies/Content.vue")
      },
      {
        path: "/policies/privacy",
        name: "Privacy Policy",
        component: () => import("@/views/Policies/Privacy.vue")
      },
      {
        path: "/credits",
        name: "Credits",
        component: () => import("@/views/Credits.vue")
      },
      {
        path: "/setup",
        name: "TPU Setup Wizard",
        component: () => import("@/views/Setup.vue")
      },
      {
        path: "/:id",
        name: "Attachment Item",
        component: () => import("@/views/Item.vue")
      },
      {
        path: "/:pathMatch(.*)",
        name: "404",
        component: () => import("@/views/Errors/404.vue")
      }
    ]
  }
] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from) => {
  const user = useUserStore();
  if (
    !user.user &&
    ![
      "Login",
      "Home",
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
      "TPU Setup Wizard"
    ].includes(to.name as string)
  ) {
    console.log("Redirecting to login");
    return { name: "Home" };
  } else if (
    user.user &&
    ["Home", "Login", "Register"].includes(to.name as string)
  ) {
    console.log("Redirecting to dashboard");
    return { name: "Dashboard" };
  }
});

export default router;
