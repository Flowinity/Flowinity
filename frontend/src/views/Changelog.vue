<template>
  <v-container class="text-center">
    <h1>TPU Changelogs</h1>
    <template v-for="version in versions">
      <h2 class="mt-4">{{ version.version }}</h2>
      <v-card-title v-if="version.subheading" style="font-size: 17px">
        {{ version.subheading }}
      </v-card-title>
      <v-card-subtitle>{{ version.date }}</v-card-subtitle>
      <div v-for="change in version.changes" :key="change.text">
        <v-chip
          v-for="tag in change.tags"
          :color="tags[tag]?.color"
          class="my-2 mr-2"
        >
          {{ tag }}
        </v-chip>
        <span>{{ change.text }}</span>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue"

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
        },
        Profile: {
          color: "pink"
        }
      } as Record<string, { color: string | undefined }>,
      versions: [
        {
          version: "3.2.0",
          subheading: "Improved User Profiles!",
          date: "2023-05-09",
          changes: [
            {
              tags: ["New", "Profile"],
              text: "You can now add widgets, and customize the layout of your profile."
            },
            {
              tags: ["New", "TPU"],
              text: "You can now link external platform accounts to TPU. More integrations will be added soon."
            },
            {
              tags: ["New", "Gallery"],
              text: "You can now exclude collections from the non-collectivized filter in the Gallery, this is useful if you add items into generic collections."
            },
            {
              tags: ["New", "TPU"],
              text: "With lower resolutions, there is now a new sidebar called the Railbar, which allows you to switch between TPU, Workspaces and Communications."
            },
            {
              tags: ["New", "TPU"],
              text: "There is a new API version, documentation is at /api/v3/docs. This will replace APIv2 completely in the future."
            }
          ]
        },
        {
          version: "3.1.1 - 3.1.5",
          date: "2023-04-13",
          changes: [
            {
              tags: ["New", "Communications"],
              text: "There is now a message separator between different days"
            },
            {
              tags: ["New", "Gallery"],
              text: "The gallery now automatically refreshes on all clients when you upload an item from a different device"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fixed the Automate flow and made it compatible with TPUv2"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fixed the sidebars from opening on mobile if you were scrolling vertically on tabs and other elements"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fix multi-select in AutoCollects"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fix blur/glass effect on Safari and other WebKit browsers"
            },
            {
              tags: ["Fix", "Communications"],
              text: "Improved read receipts for lower resolution devices"
            }
          ]
        },
        {
          version: "3.1.0",
          date: "2023-04-02",
          subheading: "The Insights Update",
          changes: [
            {
              tags: ["New", "TPU"],
              text: "Introducing the new Insights, get historical and relevant reports by week, month, year and an all-time dynamic report"
            }
          ]
        },
        {
          version: "3.0.24",
          date: "2023-03-27",
          changes: [
            {
              tags: ["Performance", "TPU"],
              text: "Fixed performance issues with glass option in the theme editor"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Styled the buttons in Slideshows/AutoCollect Configure and tables across TPU"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Improved dialog styling"
            },
            {
              tags: ["Fix", "TPU"],
              text: "Fixed CSS editor"
            }
          ]
        },
        {
          version: "3.0.23",
          date: "2023-03-26",
          changes: [
            {
              tags: ["New", "TPU"],
              text: "Introducing the theme editor allowing you to customize TPU (beta)"
            },
            {
              tags: ["New", "TPU"],
              text: "Your profile now adapts to your chosen theme for other users (disable in Settings)"
            }
          ]
        },
        {
          version: "3.0.21 / 3.0.22",
          date: "2023-03-19",
          changes: [
            {
              tags: ["New", "TPU"],
              text: "Friend nicknames are back!"
            },
            {
              tags: ["New", "Communications"],
              text: "You can now close DMs"
            },
            {
              tags: ["Fix", "Communications"],
              text: "Fixed duplicate direct messages on legacy Colubrina users"
            },
            {
              tags: ["Fix", "Communications"],
              text: "Legacy groups now have owners"
            }
          ]
        },
        {
          version: "3.0.20",
          date: "2023-03-14",
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
              text: "Adjusted size of \"Search in files\" checkbox"
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
        subheading?: string;
        changes: {
          type: "new" | "fix" | "update";
          text: string;
          tags?: string[];
        }[];
      }[]
    }
  }
})
</script>

<style scoped></style>
