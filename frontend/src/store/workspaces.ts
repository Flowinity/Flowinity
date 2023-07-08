import {defineStore} from "pinia";
import {Router, useRouter} from "vue-router";

// Import Plugins
import axios from "@/plugins/axios";

// Import Models
import {Workspace} from "@/models/workspace";
import {Note} from "@/models/note";
import {WorkspaceFolder} from "@/models/workspaceFolder";

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
    async getRecent(): Promise<any> {
      const {data} = await axios.get("/notes/recent");

      this.recent = data;

      return data;
    },
    async getWorkspaces(): Promise<void> {
      const {data} = await axios.get("/notes/workspaces", {
        headers: {
          noToast: true
        }
      });

      this.items = data;
    },
    async selectWorkspace(id: number): Promise<void> {
      const {data} = await axios.get(`/notes/workspace/${id}`, {
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
    async refreshWorkspace(): Promise<void> {
      await this.selectWorkspace(<number>this.workspace?.id);
    },
    async init(): Promise<void> {
      const selectedWorkspace: string = localStorage.getItem("selectedWorkspace");

      if (selectedWorkspace) await this.selectWorkspace(JSON.parse(selectedWorkspace).id);

      await this.getWorkspaces();
    }
  },
  getters: {
    isWorkspaces() {
      const router: Router = useRouter();

      return (
        router.currentRoute.value.path.startsWith("/workspaces/") ||
        router.currentRoute.value.path.startsWith("/notes/")
      );
    },
    recentOverall() {
      const notes: Note[] = this.recent
        .map((workspace) => workspace.folders.map((folder: WorkspaceFolder) => folder.notes))
        .flat(2)
        .sort((a, b): number => {
          if (a.updatedAt > b.updatedAt) return -1;
          if (a.updatedAt < b.updatedAt) return 1;
          return 0;
        });

      return notes.slice(0, 12);
    }
  }
});
