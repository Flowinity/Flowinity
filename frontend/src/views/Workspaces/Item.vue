<template>
  <div id="workspaces-editor">
    <div class="editorx_body" :key="$route.params.version || $route.params.id">
      <div class id="tpu-editor" />
    </div>
    <v-toolbar
      flat
      color="dark"
      bottom
      dense
      fixed
      id="workspaces-word-count"
      v-if="!this.id"
      :class="{ patch: !$vuetify.display.mobile }"
    >
      <v-card-subtitle
        >Words: {{ words.toLocaleString() }} • Characters:
        {{ characters.toLocaleString() }} • Speaking Time:
        <span
          >{{ speakingTime }}
          <v-tooltip activator="parent" location="top">
            <span>Average 150wpm estimate</span>
          </v-tooltip></span
        >
      </v-card-subtitle>
    </v-toolbar>
    <WorkspaceHome v-if="fail" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
//@ts-ignore
import Header from "editorjs-header-with-anchor";
//@ts-ignore
import NestedList from "@troplo/tpu-editorjs-nested-list";
//@ts-ignore
import CodeTool from "@editorjs/code";
//@ts-ignore
import Paragraph from "@editorjs/paragraph";
//@ts-ignore
import Embed from "@editorjs/embed";
//@ts-ignore
import Table from "@editorjs/table";
//@ts-ignore
import Checklist from "@editorjs/checklist";
//@ts-ignore
import Marker from "@editorjs/marker";
//@ts-ignore
import Warning from "@editorjs/warning";
//@ts-ignore
import RawTool from "@editorjs/raw";
//@ts-ignore
import Quote from "@editorjs/quote";
//@ts-ignore
import InlineCode from "@editorjs/inline-code";
//@ts-ignore
import Delimiter from "@editorjs/delimiter";
//@ts-ignore
import ImageTool from "@editorjs/image";
//@ts-ignore
import EditorJS from "@editorjs/editorjs";
//@ts-ignore
import Attaches from "@editorjs/attaches";
//@ts-ignore
import LinkTool from "@editorjs/link";
//@ts-ignore
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
//@ts-ignore;
import WorkspaceHome from "@/views/Workspaces/Home";
//@ts-ignore
import Undo from "editorjs-undo";
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkspaceItem",
  components: { WorkspaceHome },
  props: ["id"],
  data() {
    return {
      data: null,
      fail: false,
      words: 0,
      characters: 0,
      lastSave: null as any
    };
  },
  methods: {
    async upload(file: any) {
      try {
        let formData = new FormData();
        formData.append("attachment", file);

        const { data } = await this.axios.post("/gallery", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        return {
          success: 1,
          file: {
            url: this.$app.domain + data.upload.attachment,
            name: data.upload.name,
            size: data.upload.fileSize,
            extension: data.upload.name.split(".").pop(),
            title: data.upload.name
          },
          title: data.upload.name
        };
      } catch {
        this.$toast.error("The file could not be uploaded.");
        return {
          success: 0
        };
      }
    },
    async save(data: object, manualSave = false) {
      try {
        if (this.lastSave && Date.now() - this.lastSave < 500) return;
        this.lastSave = Date.now();
        this.$app.notesSaving = true;
        await this.axios.patch("/notes/" + this.$route.params.id, {
          data,
          manualSave
        });
        this.$app.notesSaving = false;
        console.log("[TPU/Editor] Saved!");
      } catch (e) {
        console.log(e);
        this.$app.notesSaving = false;
        this.$toast.error("The document could not be saved.");
      }
    },
    getItemCount(item: any, type: any) {
      let count = 0;
      if (item.items?.length) {
        count += item.items.reduce((acc: any, item: any) => {
          return acc + this.getItemCount(item, type);
        }, 0);
      }
      if (item.content) {
        if (type === "char") {
          count += item.content.length;
        } else if (type === "word") {
          count += item.content.split(" ").length;
        }
      }
      return count;
    },
    count(blocks: any) {
      this.characters = blocks.reduce((acc, block) => {
        if (block.data.text) {
          return acc + block.data.text.length || 0;
        } else if (block.data.content?.length) {
          return (
            acc +
            block.data.content.reduce((acc, row) => {
              row.forEach((cell) => {
                acc += cell.length || 0;
              });
              return acc;
            }, 0)
          );
        } else if (block.data.items?.length) {
          return (
            acc +
            block.data.items.reduce((acc, item) => {
              return acc + this.getItemCount(item, "char") || 0;
            }, 0)
          );
        } else {
          return acc;
        }
      }, 0);
      this.words = blocks.reduce((acc, block) => {
        if (block.data.text) {
          return acc + block.data.text?.split(" ").length || 0;
        } else if (block.data.content?.length) {
          return (
            acc +
            block.data.content.reduce((acc, row) => {
              row.forEach((cell) => {
                acc += cell?.split(" ").length || 0;
              });
              return acc;
            }, 0)
          );
        } else if (block.data.items?.length) {
          return (
            acc +
            block.data.items.reduce((acc, item) => {
              return acc + this.getItemCount(item, "word") || 0;
            }, 0)
          );
        } else {
          return acc;
        }
      }, 0);
    },
    editor(data, readOnly) {
      window.__TROPLO_INTERNALS_EDITOR_SAVE = this.save;
      window.__TROPLO_INTERNALS_EDITOR_UPLOAD = this.upload;
      window.__TROPLO_INTERNALS_UPDATE_COUNT = this.count;
      //window.__TROPLO_INTENRALS_SOCKET = this.$socket;
      window.__TROPLO_INTERNALS_NOTE_ID = this.$route.params.id;
      //this.$socket.emit("notes/subscribe", this.$route.params.id);
      let init = {
        holder: "tpu-editor",
        autofocus: true,
        logLevel: "ERROR",
        readOnly,
        /**
         * This Tool will be used as default
         */
        defaultBlock: "paragraph",
        tools: {
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+C"
          },
          linkTool: {
            class: LinkTool
          },
          header: {
            class: Header,
            shortcut: "CMD+SHIFT+H",
            tunes: ["align"]
          },
          list: {
            class: NestedList
          },
          paragraph: {
            class: Paragraph,
            tunes: ["align"],
            config: {
              placeholder: "."
            }
          },
          embed: {
            class: Embed
          },
          attaches: {
            class: Attaches,
            config: {
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */ async uploadByFile(file) {
                  return await window.__TROPLO_INTERNALS_EDITOR_UPLOAD(file);
                }
              },
              endpoints: {
                byFile: "/api/v2/gallery"
              },
              field: "attachment"
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          },
          checklist: {
            class: Checklist
          },
          Marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M"
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+W",
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message"
            }
          },
          raw: RawTool,
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author"
            }
          },
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+M"
          },
          delimiter: Delimiter,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */ async uploadByFile(file) {
                  return await window.__TROPLO_INTERNALS_EDITOR_UPLOAD(file);
                }
              },
              endpoints: {
                byFile: "/api/v2/gallery"
              },
              field: "attachment"
            }
          },
          align: {
            class: AlignmentTuneTool,
            config: {
              default: "left",
              blocks: {
                header: "center",
                list: "left"
              }
            }
          }
        },
        onReady() {
          const undo = new Undo({
            editor,
            config: {
              debounceTimer: 30,
              shortcuts: {
                undo: "CMD+Z",
                redo: "CMD+SHIFT+Z"
              }
            }
          });
          undo.initialize(init.data);
          console.log("[TPU/Editor] Ready.");
          window.__TROPLO_INTERNALS_UPDATE_COUNT(
            editor.configuration.data.blocks
          );
        },
        onChange() {
          console.log("[TPU/Editor] Saving...");
          editor.save().then(async (outputData) => {
            await window.__TROPLO_INTERNALS_EDITOR_SAVE(outputData);
            await window.__TROPLO_INTERNALS_UPDATE_COUNT(outputData.blocks);
          });
        }
      };
      if (Object.keys(data).length) {
        init.data = data;
      }
      window.editor = new EditorJS(init);
    },
    async getNote(id) {
      return await this.axios.get("/notes/" + id);
    },
    onMounted() {
      this.fail = false;
      this.getNote(this.id || this.$route.params.id)
        .then((res) => {
          this.$app.title = res.data.name;
          if (!this.id) {
            this.$app.lastNote = parseInt(this.$route.params.id);
            localStorage.setItem("lastNote", this.$route.params.id);
          }
          const note = this.$route.params.version
            ? res.data.versions?.find(
                (v) => v.id === this.$route.params.version
              ).data
            : res.data.data;
          try {
            this.editor(
              note,
              this.$route.params.version || !res.data.permissions.modify
            );
          } catch (e) {
            console.log(e);
            this.editor(null);
          }
        })
        .catch((e) => {
          console.log(e);
          this.fail = true;
        });

      document.addEventListener(
        "keydown",
        (e) => {
          if (
            (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
            e.keyCode === 83
          ) {
            e.preventDefault();
            editor.save().then((outputData) => {
              window.__TROPLO_INTERNALS_EDITOR_SAVE(outputData, true);
            });
          }
        },
        false
      );
    }
  },
  computed: {
    speakingTime() {
      const avgWordsPerMinute = 150;
      const minutes = Math.floor(this.words / avgWordsPerMinute);
      const seconds = Math.floor(
        (this.words / avgWordsPerMinute - minutes) * 60
      );

      let result = "";
      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        result += `${hours}h`;
      }
      if (minutes > 0) {
        result += `${minutes % 60}m`;
      }
      if (seconds > 0) {
        result += `${seconds}s`;
      }

      if (!result) result = "0s";

      return result;
    },
    toolbarStyles() {
      if (this.$app.mainDrawer && !this.$vuetify.display.mobile)
        return "margin-left: 256px";
      else return {};
    }
  },
  mounted() {
    this.onMounted();
    if (!this.$app.workspaceDrawer && !this.$vuetify.display.mobile) {
      this.$app.forcedWorkspaceDrawer = true;
      this.$app.workspaceDrawer = true;
    }
    this.$app.title = "Workspace Editor";
  },
  unmounted() {
    this.$app.workspaceDrawer =
      localStorage.getItem("workspaceDrawer") === "true";
    this.$app.forcedWorkspaceDrawer = false;
  },
  watch: {
    $route(val) {
      if (!val.params.id) return;
      this.onMounted();
    }
  }
});
</script>

<style>
.cdx-settings-input {
  color: white !important;
}

.cdx-settings-item svg {
  fill: white !important;
}

.cdx-settings-button svg {
  fill: white !important;
}

.cdx-settings-button--active svg {
  fill: #0190ea !important;
}

.ce-code__textarea {
  color: white !important;
  background-color: var(--v-bg-base) !important;
  border: 1px solid var(--v-bg-lighten4) !important;
}

.tc-add-column svg {
  text-align: center;
}
.tc-cell[heading] {
  background-color: var(--v-toolbar-lighten1) !important;
}
.tc-table {
  border-top: 1px solid var(--v-bg-lighten4) !important;
}
.tc-add-column {
  border-right: 1px solid var(--v-bg-lighten4) !important;
  border-top: 1px solid var(--v-bg-lighten4) !important;
  border-bottom: 1px solid var(--v-bg-lighten4) !important;
  background-color: var(--v-toolbar-base) !important;
  z-index: 2;
}
.tc-add-column:hover {
  transition: 0.1s;
  background-color: var(--v-toolbar-lighten1) !important;
}
.tc-add-column svg {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.tc-add-row {
  margin-top: 0 !important;
  border-bottom: 1px solid var(--v-bg-lighten4) !important;
  border-left: 1px solid var(--v-bg-lighten4) !important;
  border-right: 1px solid var(--v-bg-lighten4) !important;
  background-color: var(--v-toolbar-base) !important;
  z-index: 2;
}
.tc-add-row:hover {
  transition: 0.1s;
  background-color: var(--v-toolbar-lighten1) !important;
}
.tc-add-row:hover:before {
  background-color: unset !important;
}
.tc-add-row svg {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.tc-row {
  border-bottom: 1px solid var(--v-bg-lighten4) !important;
  border-left: 1px solid var(--v-bg-lighten4) !important;
  border-right: 1px solid var(--v-bg-lighten4) !important;
}
.tc-wrap {
  --color-border: var(--v-bg-lighten3) !important;
}

.tc-toolbox__toggler {
  color: white !important;
}

.tc-toolbox__toggler svg rect {
  fill: #202020 !important;
}

.ce-inline-tool-input,
.cdx-search-field__input {
  color: white;
}

@media (min-width: 1650px) and (max-width: 2000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1000px !important;
  }
}

@media (min-width: 2000px) and (max-width: 3000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1400px !important;
  }
}

@media (min-width: 3000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1800px !important;
  }
}

@media (min-width: 1300px) and (max-width: 1650px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 650px !important;
  }
}

#workspaces-editor .v-toolbar {
  bottom: 0 !important;
  top: unset !important;
  position: absolute;
  width: 100%;
}

#workspaces-editor .patch {
  width: calc(100% - 256px) !important;
}

.tc-toolbox {
  z-index: 3 !important;
}
</style>
