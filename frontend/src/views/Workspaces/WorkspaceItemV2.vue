<template>
  <editor-v2-header v-if="editor" :id="id || <string>$route.params.id" />
  <editor-v2-bubble-menu v-if="editor" />
  <v-container class="px-12">
    <editor-content :editor="editor" />
  </v-container>
</template>

<script setup lang="ts">
import { Editor, EditorContent, useEditor } from "@tiptap/vue-3";
import { computed, onMounted, provide, ref, watch } from "vue";
import { StarterKit } from "@tiptap/starter-kit";
import EditorV2Header from "@/components/Workspaces/EditorV2/Navigation/EditorV2Header.vue";
import {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  defaultBubbleList,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Image,
  Indent,
  Italic,
  Link,
  MarkdownTheme,
  OrderedList,
  Strike,
  SubAndSuperScript,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video
} from "@/components/Workspaces/EditorV2/Core/extensions";
import { useEditorStore } from "@/store/editor.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import { useRoute } from "vue-router";
import EditorV2BubbleMenu from "@/components/Workspaces/EditorV2/Core/EditorV2BubbleMenu.vue";

const editorStore = useEditorStore();
const workspaceStore = useWorkspacesStore();
const route = useRoute();

const props = defineProps({
  id: {
    type: String,
    required: false
  }
});

const editor = useEditor({
  content: "Loading...",
  extensions: [
    BaseKit,
    Blockquote,
    Bold,
    BulletList,
    Clear,
    Code,
    CodeBlock,
    Color,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    History,
    HorizontalRule,
    Image,
    Indent,
    Italic,
    Link,
    MarkdownTheme,
    OrderedList,
    Strike,
    SubAndSuperScript,
    Table,
    TaskList,
    TextAlign,
    Underline,
    Video
  ]
});

provide("editor", editor);

async function init() {
  const res = await workspaceStore.getNote(props.id || route.params.id);
  console.log(res, "res");
  editor.value.commands.setContent(res.data.content || "");
}

onMounted(() => {
  init();
});

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await init();
    }
  }
);
</script>
