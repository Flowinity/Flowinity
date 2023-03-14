<template>
  <v-container class="text-center">
    <h1>TPU Changelogs</h1>
    <template v-for="version in versions">
      <h2 class="mt-4">{{ version.version }}</h2>
      <v-card-subtitle>{{ version.date }}</v-card-subtitle>
      <div v-for="change in version.changes" :key="change.text">
        <v-chip
          class="my-2 mr-2"
          v-for="tag in change.tags"
          :color="tags[tag]?.color"
        >
          {{ tag }}
        </v-chip>
        <span>{{ change.text }}</span>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Changelog",
  data() {
    return {
      tags: {
        Communications: {
          color: "gold"
        },
        TPU: {
          color: "blue"
        },
        Fix: {
          color: undefined
        },
        New: {
          color: "success"
        },
        Gallery: {
          color: "indigo-lighten-2"
        },
        Workspaces: {
          color: "teal"
        },
        Performance: {
          color: "orange"
        }
      } as Record<string, { color: string | undefined }>,
      versions: [
        {
          version: "3.0.20",
          date: "2021-03-14",
          changes: [
            {
              tags: ["New", "TPU"],
              text: "Added AMOLED theme"
            },
            {
              tags: ["New", "TPU"],
              text: "3.14"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fixed sessions not expiring, and not storing IP address history"
            }
          ]
        },
        {
          version: "3.0.19",
          date: "2023-03-13",
          changes: [
            {
              tags: ["New", "TPU"],
              text: "Added changelogs"
            },
            {
              text: "Improved chat loading performance",
              tags: ["Performance", "Communications"]
            },
            {
              text: "Improved chip render performance",
              tags: ["Performance", "TPU"]
            },
            {
              text: "Website now has a meta tag to disable Dark Reader",
              tags: ["Fix", "TPU"]
            },
            {
              text: "Fixed GIF picker",
              tags: ["Fix", "Communications"]
            },
            {
              tags: ["Fix", "Communications"],
              text: "You can now pin messages other than your own"
            },
            {
              text: "Inability to paste in editing input or search bar",
              tags: ["Fix", "Communications"]
            },
            {
              text: "Fix scaling issues for lower resolutions",
              tags: ["Fix", "Workspaces"]
            },
            {
              text: "Fix stats going off screen on mobile",
              tags: ["Fix", "Workspaces"]
            },
            {
              text: "Fix user menu not showing banner and off-centered badges",
              tags: ["Fix", "Communications"]
            },
            {
              text: "You can now click on the username to go to their full profile on the expanded user dialog",
              tags: ["Fix", "Communications"]
            }
          ]
        },
        {
          version: "3.0.18",
          date: "2023-03-12",
          changes: [
            {
              tags: ["New", "Communications"],
              text: "Added ability to pin messages"
            },
            {
              tags: ["New", "Communications"],
              text: "Added ability to adjust notification settings for chats"
            },
            {
              tags: ["New", "Communications"],
              text: "Added ability to properly mention users"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Removed unnecessary width for container depending on resolution"
            },
            {
              tags: ["Fix", "Communications"],
              text: "Fixed issue with messages not loading when scrolling up/down"
            },
            {
              tags: ["New", "TPU"],
              text: "Added loading spinner while the JavaScript is loading"
            },
            {
              tags: ["Fix", "Communications"],
              text: "Fixed when if there was no message content it would appear as though you are editing the message"
            },
            {
              tags: ["Fix", "Gallery"],
              text: 'Adjusted size of "Search in files" checkbox'
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fixed issue where background services would not run after an internal server reboot for update."
            },
            {
              tags: ["Fix", "TPU"],
              text: "Frontend files are no longer purged when updating to avoid page navigation problems if on an older version."
            }
          ]
        },
        {
          version: "3.0.17",
          date: "2023-03-11",
          changes: [
            {
              tags: ["New", "Communications"],
              text: "Added ability to pin messages"
            },
            {
              tags: ["New", "Communications"],
              text: "Improved mobile experience"
            },
            {
              tags: ["New", "Communications"],
              text: "Added mobile and desktop context menu for messages"
            },
            {
              tags: ["New", "TPU"],
              text: "All dialogs now use a consistent layout, with an X on the top right (desktop) or a back arrow on the top left (mobile)."
            },
            {
              tags: ["Fix", "Communications"],
              text: "Fixed problem where you couldn't open the user popup when clicking twice"
            },
            {
              tags: ["Fix", "Workspaces"],
              text: "Updated ShareLink with the new format"
            }
          ]
        }
      ] as {
        version: string;
        date: string;
        changes: {
          type: "new" | "fix" | "update";
          text: string;
          tags?: string[];
        }[];
      }[]
    };
  }
});
</script>

<style scoped></style>
