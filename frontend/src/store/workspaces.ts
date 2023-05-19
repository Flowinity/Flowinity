// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";
import { useRouter } from "vue-router";

export interface WorkspacesState {
  items: Workspace[];
  workspace: Workspace | null;
  recent: Workspace[];
  versionHistory: boolean;
  share: {
    dialog: boolean;
    loading: boolean;
  };
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: () =>
    ({
      items: [],
      workspace: null,
      recent: [],
      versionHistory: false,
      share: {
        dialog: false,
        loading: false
      }
    } as WorkspacesState),
  actions: {
    async getRecent() {
      const { data } = await axios.get("/notes/recent");
      this.recent = data;
      return data;
    },
    async getWorkspaces() {
      const { data } = await axios.get("/notes/workspaces", {
        headers: {
          noToast: true
        }
      });
      this.items = data;
    },
    async selectWorkspace(id: number) {
      const { data } = await axios.get(`/notes/workspace/${id}`, {
        headers: {
          noToast: true
        }
      });
      this.workspace = data;
      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify({
          id: data.id,
          name: data.name
        })
      );
    },
    async refreshWorkspace() {
      await this.selectWorkspace(<number>this.workspace?.id);
    },
    async init() {
      const selectedWorkspace = localStorage.getItem("selectedWorkspace");
      if (selectedWorkspace) {
        this.selectWorkspace(JSON.parse(selectedWorkspace).id);
      }
      this.getWorkspaces();
    }
  },
  getters: {
    isWorkspaces() {
      const router = useRouter();
      return (
        router.currentRoute.value.path.startsWith("/workspaces/") ||
        router.currentRoute.value.path.startsWith("/notes/")
      );
    },
    recentOverall() {
      const notes: Note[] = this.recent
        .map((workspace) => workspace.folders.map((folder) => folder.notes))
        .flat(2)
        .sort((a, b) => {
          if (a.updatedAt > b.updatedAt) return -1;
          if (a.updatedAt < b.updatedAt) return 1;
          return 0;
        });
      return notes.slice(0, 12);
    }
  }
});
