// Utilities
import { defineStore } from "pinia";
import { ThemeEngine, User } from "@/models/user";
import axios from "@/plugins/axios";
import { useChatStore } from "@/store/chat";
import { useWorkspacesStore } from "@/store/workspaces";
import { useCollectionsStore } from "@/store/collections";
import { useExperimentsStore } from "@/store/experiments";
import { useFriendsStore } from "@/store/friends";
import { useAppStore } from "@/store/app";
import { useToast } from "vue-toastification";
import { useMailStore } from "@/store/mail";
import vuetify from "@/plugins/vuetify";
import { useTheme } from "@troplo/vuetify";

export interface UserState {
  user: User | null;
  _postInitRan: boolean;
  changes: {
    password?: string;
    email?: string;
    discordPrecache?: boolean;
    username?: string;
    itemsPerPage?: number;
    currentPassword?: string;
    storedStatus?: string;
    description?: string;
    weatherUnit?: string;
    themeEngine: ThemeEngine;
    insights?: "everyone" | "friends" | "nobody";
  };
  actions: {
    emailSent: {
      value: boolean;
      loading: boolean;
    };
  };
}

export const useUserStore = defineStore("user", {
  state: () =>
    ({
      user: null,
      _postInitRan: false,
      changes: {
        themeEngine: {
          customCSS: ""
        }
      },
      actions: {
        emailSent: {
          value: false,
          loading: false
        }
      }
    } as UserState),
  getters: {
    theme() {
      return vuetify.theme.current.value;
    },
    gold(state: UserState) {
      if (!state.user) return false;
      return state.user.plan.id === 6;
    },
    unreadNotifications(state: UserState) {
      if (!state.user) return 0;
      return state.user.notifications.filter((n) => !n.dismissed).length;
    }
  },
  actions: {
    applyTheme() {
      try {
        if (this.user?.plan?.internalName !== "GOLD") return;
        const app = useAppStore();
        const themeData = this.user?.themeEngine?.deviceSync
          ? this?.user?.themeEngine
          : JSON.parse(localStorage.getItem("themeEngine") || "{}");
        if (themeData.version === 1) {
          this.applyCSS();
          document.body.style.setProperty(
            "--gradient-offset",
            `${themeData.gradientOffset}%`
          );
          vuetify.theme.themes.value.dark = themeData.theme.dark;
          vuetify.theme.themes.value.light = themeData.theme.light;
          vuetify.theme.themes.value.amoled = themeData.theme.amoled;
          vuetify.defaults.value = themeData.defaults;
          app.fluidGradient = themeData.fluidGradient;
          if (themeData.fluidGradient) {
            document.body.classList.add("fluid-gradient");
          } else {
            document.body.classList.remove("fluid-gradient");
          }
        } else {
          throw new Error("Invalid theme version");
        }
      } catch {
        document.body.style.setProperty("--gradient-offset", "100%");
      }
    },
    primaryColorResult(primaryColor?: string | null, gold?: boolean) {
      if (primaryColor && gold)
        return {
          gradient1: primaryColor,
          gradient2: primaryColor,
          primary: primaryColor
        };
      return gold || this.gold
        ? {
            gradient1: "#ffdb1b",
            gradient2: "#ffd700",
            primary: "#ffd700"
          }
        : {
            gradient1: "#096fea",
            gradient2: "#0166ea",
            primary: "#0190ea"
          };
    },
    async resendVerificationEmail() {
      try {
        const toast = useToast();
        this.actions.emailSent.loading = true;
        await axios.post("/user/verification/send");
        this.actions.emailSent.value = true;
        this.actions.emailSent.loading = false;
        toast.success("Verification email sent!");
      } catch {
        this.actions.emailSent.loading = false;
      }
    },
    async logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userStore");
      localStorage.removeItem("friendsStore");
      this.user = null;
      this.changes = {
        themeEngine: this.changes.themeEngine
      };
      this._postInitRan = false;
    },
    async changeStatus(status: string) {
      if (!this.user) return;
      this.changes.storedStatus = status;
      await this.save();
    },
    async runPostTasks() {
      if (this.user && !this._postInitRan) {
        console.info("[TPU/UserStore] Running post-init auth tasks");
        window._paq.push(["setUserId", this.user.id]);
        window._paq.push(["trackPageView"]);
        const app = useAppStore();
        const chat = useChatStore();
        const workspace = useWorkspacesStore();
        const collections = useCollectionsStore();
        const experiments = useExperimentsStore();
        const friends = useFriendsStore();
        const mail = useMailStore();
        experiments.init().then(() => {
          console.info("[TPU/ExperimentsStore] Experiments initialized");
        });
        collections.init().then(() => {
          console.info("[TPU/CollectionsStore] Collections initialized");
          app.populateQuickSwitcher();
        });
        workspace.init().then(() => {
          console.info("[TPU/WorkspacesStore] Workspaces initialized");
          app.populateQuickSwitcher();
        });
        chat.init().then(() => {
          console.info("[TPU/ChatStore] Chat initialized");
          app.populateQuickSwitcher();
        });
        friends.init().then(() => {
          console.info("[TPU/FriendsStore] Friends initialized");
        });
        app.getWeather().then(() => {
          console.info("[TPU/AppStore] Weather initialized");
        });
        mail.getMailboxes().then(() => {
          console.info("[TPU/MailStore] Mailboxes initialized");
        });
        // every 15 minutes update the weather
        setInterval(() => {
          app.getWeather();
        }, 1000 * 60 * 15);
        this._postInitRan = true;
        app.populateQuickSwitcher();
        if (this.user?.plan?.internalName === "GOLD") {
          vuetify.theme.themes.value.dark.colors = {
            ...vuetify.theme.themes.value.dark.colors,
            primary: "#FFD700",
            info: "#FFD700",
            logo1: "#FFDB1B",
            logo2: "#FFD700"
          };
          vuetify.theme.themes.value.light.colors = {
            ...vuetify.theme.themes.value.light.colors,
            primary: "#FFD700",
            info: "#FFD700",
            logo1: "#FFDB1B",
            logo2: "#FFD700"
          };
          vuetify.theme.themes.value.amoled.colors = {
            ...vuetify.theme.themes.value.amoled.colors,
            primary: "#FFD700",
            info: "#FFD700",
            logo1: "#FFDB1B",
            logo2: "#FFD700"
          };
          document.body.classList.add("gold");
          this.applyTheme();
          // remove other favicons
          const links = document.getElementsByTagName("link");
          for (const link of links) {
            if (link.getAttribute("rel") !== "manifest") {
              link.remove();
            }
          }
          // set favicon to gold
          const link =
            (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
            (document.createElement("link") as HTMLLinkElement);
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = `/api/v2/user/favicon.png?cache=${Date.now()}&username=${
            this.user.username
          }`;
          document.head.appendChild(link);
        }
      }
    },
    async init() {
      const user = localStorage.getItem("userStore");
      if (user) {
        try {
          this.user = JSON.parse(user);
          if (this.user) {
            this.changes = {
              password: "",
              email: this.user.email,
              discordPrecache: this.user.discordPrecache,
              username: this.user.username,
              itemsPerPage: this.user.itemsPerPage,
              currentPassword: "",
              storedStatus: this.user.storedStatus,
              description: this.user.description,
              themeEngine: this.user.themeEngine as ThemeEngine,
              insights: this.user.insights
            };
            this.runPostTasks();
          }
        } catch {
          //
        }
      }
      const { data } = await axios.get("/user");
      this.user = data;
      this.changes = {
        password: "",
        email: this.user?.email,
        discordPrecache: this.user?.discordPrecache,
        username: this.user?.username,
        itemsPerPage: this.user?.itemsPerPage,
        currentPassword: "",
        storedStatus: this.user?.storedStatus,
        description: this.user?.description,
        weatherUnit: this.user?.weatherUnit,
        themeEngine: this.user?.themeEngine as ThemeEngine,
        insights: this.user?.insights
      };
      this.applyTheme();
      localStorage.setItem("userStore", JSON.stringify(data));
      this.runPostTasks();
    },
    applyCSS(emergency: boolean = false) {
      //if (this.user?.plan.internalName !== "GOLD") return;
      if (this.changes.themeEngine?.customCSS !== undefined) {
        let style = document.getElementById("user-css");
        if (style?.innerHTML === "") {
          emergency = false;
        }
        if (style) {
          style.remove();
        }
        style = document.createElement("style");
        style.id = "user-css";
        style.innerHTML = emergency ? "" : this.changes.themeEngine.customCSS;
        document.head.appendChild(style);
      }
    },
    async save() {
      if (!this.user) return;
      this.applyCSS();
      await axios.patch("/user", {
        password: this.changes.password,
        currentPassword: this.changes.currentPassword,
        email: this.changes.email,
        discordPrecache: this.changes.discordPrecache,
        username: this.changes.username,
        itemsPerPage: this.changes.itemsPerPage,
        storedStatus: this.changes.storedStatus,
        description: this.changes.description,
        weatherUnit: this.changes.weatherUnit,
        themeEngine: this.changes.themeEngine,
        insights: this.changes.insights
      });
      this.user = {
        ...this.user,
        ...(this.changes as any)
      };
    }
  }
});
