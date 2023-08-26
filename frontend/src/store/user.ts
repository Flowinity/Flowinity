// Utilities
import { defineStore } from "pinia";
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
import i18n from "@/plugins/i18n";
import functions from "@/plugins/functions";
import { GetUserQuery } from "@/graphql/query/user/user.graphql";
import { UpdateUserMutation } from "@/graphql/mutation/user/update.graphql";
import {
  ProfileLayout,
  ThemeEngine,
  UpdateUserInput,
  User
} from "@/gql/graphql";
import { ProfileQuery } from "@/graphql/query/user/profile.graphql";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
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
    },
    defaultVuetify: null,
    disableProfileColors:
      localStorage.getItem("disableProfileColors") === "true"
  }),
  getters: {
    contrast() {
      return functions.contrast(vuetify.theme.current.value.colors.primary);
    },
    theme() {
      return vuetify.theme.current.value;
    },
    gold(state) {
      if (!state.user) return false;
      return state.user.plan.internalName === "GOLD";
    },
    unreadNotifications(state) {
      if (!state.user) return 0;
      return state.user.notifications.filter((n) => !n.dismissed).length;
    }
  },
  actions: {
    async getUser(username?: string, id?: number) {
      const {
        data: { user }
      } = await this.$apollo.query({
        query: ProfileQuery,
        variables: {
          input: {
            username,
            id
          }
        }
      });
      return user;
    },
    applyTheme() {
      try {
        const app = useAppStore();
        if (
          this.user?.plan?.internalName !== "GOLD" &&
          app.site.officialInstance
        )
          return;
        const themeData = this.user?.themeEngine?.deviceSync
          ? this?.user?.themeEngine
          : JSON.parse(localStorage.getItem("themeEngine") || "{}");
        if (themeData.version === 1) {
          this.applyCSS();
          document.body.style.setProperty(
            "--gradient-offset",
            `${themeData.gradientOffset}%`
          );
          vuetify.theme.themes.value.dark.colors =
            themeData.theme.dark.colors ??
            vuetify.theme.themes.value.dark.colors;
          vuetify.theme.themes.value.light.colors =
            themeData.theme.light.colors ??
            vuetify.theme.themes.value.light.colors;
          vuetify.theme.themes.value.amoled.colors =
            themeData.theme.amoled.colors ??
            vuetify.theme.themes.value.amoled.colors;

          app.fluidGradient = themeData.fluidGradient;
          if (themeData.fluidGradient) {
            document.body.classList.add("fluid-gradient");
          } else {
            document.body.classList.remove("fluid-gradient");
          }
        } else {
          throw new Error("Invalid theme version");
        }
      } catch (e) {
        console.log(e);
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
      localStorage.removeItem("themeEngine");
      this.user = null;
      this._postInitRan = false;
    },
    async changeStatus(status: string) {
      if (!this.user) return;
      this.user.storedStatus = status;
      await this.save();
    },
    setChanges(user: User) {
      if (!user) return;
      this.changes = {
        email: user.email,
        discordPrecache: user.discordPrecache,
        username: user.username,
        itemsPerPage: user.itemsPerPage,
        storedStatus: user.storedStatus,
        description: user.description,
        insights: user.insights,
        profileLayout: user.profileLayout,
        excludedCollections: user.excludedCollections,
        language: user.language,
        publicProfile: user.publicProfile,
        weatherUnit: user.weatherUnit,
        privacyPolicyAccepted: user.privacyPolicyAccepted,
        nameColor: user.nameColor
      };
    },
    async init() {
      console.log(1);
      const user = localStorage.getItem("userStore");
      if (user) {
        try {
          this.user = JSON.parse(user);
          if (this.user) {
            this.setChanges(this.user);
            this.runPostTasks();
          }
        } catch {
          //
        }
      }
      console.log(2);
      const {
        data: { currentUser }
      } = await this.$apollo.query({
        query: GetUserQuery
      });
      this.user = currentUser;
      this.setChanges(<User>this.user);
      if (this.user?.themeEngine?.defaults?.prev) {
        delete this.user.themeEngine.defaults?.prev;
      }
      this.applyTheme();
      localStorage.setItem("userStore", JSON.stringify(currentUser));
      this.runPostTasks();
    },
    applyCSS(emergency: boolean = false) {
      //if (this.user?.plan.internalName !== "GOLD") return;
      if (
        this.changes.themeEngine?.customCSS !== undefined &&
        this.changes.themeEngine?.customCSS !== null
      ) {
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
      // prev is undocumented and contains previous Vuetify values causing a memory leak
      //@ts-ignore
      if (this.changes.themeEngine?.prev) {
        //@ts-ignore
        delete this.changes.themeEngine?.prev;
      }
      /*if (!this.changes.themeEngine?.theme.dark.colors) {
        this.changes.themeEngine.theme.dark.colors =
          this.defaultVuetify.dark.colors;
      }
      if (!this.changes.themeEngine?.theme.light.colors) {
        this.changes.themeEngine.theme.light.colors =
          this.defaultVuetify.light.colors;
      }
      if (!this.changes.themeEngine?.theme.amoled.colors) {
        this.changes.themeEngine.theme.amoled.colors =
          this.defaultVuetify.amoled.colors;
      }*/
      await this.$apollo.mutate({
        mutation: UpdateUserMutation,
        variables: {
          input: {
            ...this.changes,
            themeEngine: {
              ...this.user.themeEngine,
              theme: {
                amoled: {
                  colors: vuetify.theme.themes.value.amoled.colors,
                  dark: vuetify.theme.themes.value.amoled.dark
                },
                dark: {
                  colors: vuetify.theme.themes.value.dark.colors,
                  dark: vuetify.theme.themes.value.dark.dark
                },
                light: {
                  colors: vuetify.theme.themes.value.light.colors,
                  dark: vuetify.theme.themes.value.light.dark
                }
              }
            }
          }
        } as UpdateUserInput
      });
      this.user = {
        ...this.user,
        ...(this.changes as any)
      };
      i18n.global.locale = this.user?.language || "en";
    },
    async savePasswordRequired() {
      // TODO: new GraphQL mutation
    }
  }
});
