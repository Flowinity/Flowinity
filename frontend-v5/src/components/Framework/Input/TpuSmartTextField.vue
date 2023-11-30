<template>
  <div>
    <editor-content
      :editor="editor"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    {{ modelValue }}
  </div>
</template>
<script setup lang="ts">
import { PartialUserFriend } from "@/gql/graphql";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { onBeforeUnmount, watch } from "vue";
import { Markdown } from "tiptap-markdown";
import { Mention } from "@tiptap/extension-mention";
import { useUserStore } from "@/stores/user.store";

Markdown.configure({
  html: false
});

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const userStore = useUserStore();

const editor = useEditor({
  extensions: [
    StarterKit,
    Mention.configure({
      HTMLAttributes: {
        class: "mention"
      },
      suggestion: {
        items: ({ query }) => {
          return userStore.tracked
            .filter((item: PartialUserFriend) => {
              return (
                !query ||
                item.username.toLowerCase().startsWith(query.toLowerCase())
              );
            })
            .map((item: PartialUserFriend) => {
              return {
                label: item.username,
                id: item.id
              };
            });
        },
        render: (item) => {
          return `@${item?.label}`;
        }
      },
      matcher: {
        char: "<@",
        allowSpaces: false,
        startOfLine: false,
        endOfLine: true
      }
    })
  ],
  onUpdate: ({ editor }) => {
    if (editor.getText() === props.modelValue) return;
    emit("update:modelValue", editor.getText());
  },
  parseOptions: {
    preserveWhitespace: true
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (value === editor.value?.getText()) return;
    editor.value?.commands.setContent(value, false);
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
