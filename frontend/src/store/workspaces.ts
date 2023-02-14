// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";

export interface WorkspacesState {
  items: Workspace[];
  workspace: Workspace | null;
  recent: Note[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: () =>
    ({
      items: [],
      workspace: null,
      recent: []
    } as WorkspacesState),
  actions: {
    async getRecent() {
      const { data } = await axios.get("/notes/recent");
      this.recent = data as Note[];
      return data;
    },
    async getWorkspaces() {
      const { data } = await axios.get("/notes/workspaces");
      this.items = data;
    },
    async selectWorkspace(id: number) {
      const { data } = await axios.get(`/notes/workspace/${id}`);
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
  }
});
