// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import { NoteQuery } from "@/graphql/workspaces/note.graphql";
import { isNumeric } from "@/plugins/isNumeric";
import { SaveNoteMutation } from "@/graphql/workspaces/saveNote.graphql";
import { type SaveNoteInput, type WorkspaceNote } from "@/gql/graphql";

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
    async getNote(id: string | number) {
      const {
        data: { note }
      } = await this.$apollo.query({
        query: NoteQuery,
        variables: {
          input: {
            id: isNumeric(id)
              ? typeof id === "number"
                ? id
                : parseInt(id)
              : undefined,
            shareLink: !isNumeric(id) ? id : undefined
          }
        },
        fetchPolicy: "no-cache"
      });
      return note;
    },
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
    selectWorkspace(id: number) {
      const workspace = this.items.find((w) => w.id === id);
      if (!workspace) return;
      this.workspace = workspace;
      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify({
          id: workspace.id,
          name: workspace.name
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
    },
    async saveNote(data: WorkspaceNote, manualSave = false) {
      await this.$apollo.mutate({
        mutation: SaveNoteMutation,
        variables: {
          input: {
            id: parseInt(this.$app.$route.params.id),
            data,
            manualSave
          } as SaveNoteInput
        }
      });
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
