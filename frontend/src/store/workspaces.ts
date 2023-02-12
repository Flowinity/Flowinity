// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";

export interface WorkspacesState {
  items: Workspace[];
  workspace: Workspace | null;
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: () =>
    ({
      items: [],
      workspace: null
    } as WorkspacesState),
  actions: {
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
    async init() {
      const selectedWorkspace = localStorage.getItem("selectedWorkspace");
      if (selectedWorkspace) {
        this.selectWorkspace(JSON.parse(selectedWorkspace).id);
      }
      this.getWorkspaces();
    }
  }
});
