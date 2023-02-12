<template>
  <v-navigation-drawer
    v-model="$app.workspaceDrawer"
    app
    color="dark"
    floating
    location="right"
    :class="
      $app.workspaceDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''
    "
  >
    <v-list density="comfortable" nav class="mt-2">
      <div
        style="color: #0190ea; cursor: pointer; font-size: 12px"
        class="unselectable mt-n2 mb-1"
        @click="$app.workspaceDrawer = false"
      >
        <v-icon color="primary" size="20">mdi-close</v-icon>
        Close sidebar
      </div>
      <v-list-item
        class="px-2 unselectable"
        id="workspace-select"
        style="cursor: pointer"
      >
        {{ $workspaces.workspace?.name || "None selected" }}
        <template v-slot:append>
          <v-list-item-action v-if="$workspaces.workspace">
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-menu activator="#workspace-select">
        <v-list>
          <v-list-item
            v-for="item in $workspaces.items"
            :key="item.id"
            :value="item.id"
            @click="$workspaces.selectWorkspace(item.id)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-if="$workspaces.workspace">
        <v-list-group
          v-for="item in $workspaces.workspace.folders"
          :key="item.id"
          :value="item.id"
          :title="item.name"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>{{ props.title }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="note in item.children"
            :key="note.id"
            :to="'/workspaces/notes/' + note.id"
            :value="note.workspaceFolderId"
          >
            <v-list-item-title style="text-overflow: ellipsis">{{
              note.name
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Create a new note</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkspacesSidebar"
});
</script>
