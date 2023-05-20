<template>
  <CoreDialog v-model="dialog" max-width="600">
    <template v-slot:title>Add Social Link</template>
    <v-container>
      <v-text-field v-model="link.name" label="Text" maxlength="20" />
      <v-text-field v-model="link.url" label="URL" />
      <v-color-picker
        v-model="link.color"
        label="Color"
        mode="hex"
        width="100%"
      />
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="
          $emit('addLink', [...(component?.props?.links ?? []), ...[link]]);
          dialog = false;
          link = {
            name: '',
            url: '',
            color: ''
          };
        "
      >
        Add
      </v-btn>
    </v-card-actions>
  </CoreDialog>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>{{ user.username }}'s Social Links</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-chip
        v-for="link in component?.props?.links"
        @click="$chat.processLink(link.url)"
        target="_blank"
        class="mr-2 unselectable"
        :color="link.color"
      >
        {{ link.name }}
        <v-icon
          small
          v-if="user.id === $user.user?.id"
          class="ml-1"
          @click.prevent="
            $emit(
              'addLink',
              component.props.links.filter((l) => l !== link)
            )
          "
        >
          mdi-close
        </v-icon>
      </v-chip>
      <v-chip @click="dialog = true" v-if="user.id === $user.user?.id">
        <v-icon class="mr-1">mdi-plus</v-icon>
        Add Link
      </v-chip>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "SocialLinks",
  components: { CoreDialog },
  props: ["user", "component"],
  emits: ["addLink"],
  data() {
    return {
      dialog: false,
      link: {
        name: "",
        url: "",
        color: ""
      }
    };
  }
});
</script>

<style scoped></style>
