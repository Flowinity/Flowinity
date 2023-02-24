// Utilities
import { defineStore } from "pinia";
import { User } from "@/models/user";
import axios from "@/plugins/axios";
import { useChatStore } from "@/store/chat";
import { useWorkspacesStore } from "@/store/workspaces";
import { useCollectionsStore } from "@/store/collections";
import { useExperimentsStore } from "@/store/experiments";
import { useFriendsStore } from "@/store/friends";

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
  };
}

export const useUserStore = defineStore("user", {
  state: () =>
    ({
      user: null,
      _postInitRan: false,
      changes: {}
    } as UserState),
  getters: {
    unreadNotifications(state: UserState) {
      if (!state.user) return 0;
      return state.user.notifications.filter((n) => !n.dismissed).length;
    }
  },
  actions: {
    async changeStatus(status: string) {
      if (!this.user) return;
      this.changes.storedStatus = status;
      await this.save();
    },
    async runPostTasks() {
      if (this.user && !this._postInitRan) {
        console.info("[TPU/UserStore] Running post-init auth tasks");
        const chat = useChatStore();
        const workspace = useWorkspacesStore();
        const collections = useCollectionsStore();
        const experiments = useExperimentsStore();
        const friends = useFriendsStore();
        experiments.init().then(() => {
          console.info("[TPU/ExperimentsStore] Experiments initialized");
        });
        collections.init().then(() => {
          console.info("[TPU/CollectionsStore] Collections initialized");
        });
        workspace.init().then(() => {
          console.info("[TPU/WorkspacesStore] Workspaces initialized");
        });
        chat.init().then(() => {
          console.info("[TPU/ChatStore] Chat initialized");
        });
        friends.init().then(() => {
          console.info("[TPU/FriendsStore] Friends initialized");
        });
        this._postInitRan = true;
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
              description: this.user.description
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
        description: this.user?.description
      };
      localStorage.setItem("userStore", JSON.stringify(data));
      this.runPostTasks();
    },
    async save() {
      if (!this.user) return;
      await axios.patch("/user", {
        password: this.changes.password,
        currentPassword: this.changes.currentPassword,
        email: this.changes.email,
        discordPrecache: this.changes.discordPrecache,
        username: this.changes.username,
        itemsPerPage: this.changes.itemsPerPage,
        storedStatus: this.changes.storedStatus,
        description: this.changes.description
      });
      this.user = {
        ...this.user,
        ...(this.changes as any)
      };
    }
  }
});
