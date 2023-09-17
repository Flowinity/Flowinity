<template>
  <overline position="center">
    {{ selectedRank?.name || $t("chats.settings.ranks.name") }}
  </overline>
  <div class="d-flex flex-grow-1">
    <v-tabs direction="vertical" v-model="selected">
      <v-tab
        v-for="rank in $chat.editingChat.ranks"
        :value="rank.id"
        :disabled="rank.managed"
      >
        <div>
          {{ rank.name }}
          <v-icon class="float-right" v-if="rank.managed">mdi-lock</v-icon>
        </div>
      </v-tab>
      <v-btn>
        <v-icon class="mr-2">mdi-plus</v-icon>
        New
      </v-btn>
    </v-tabs>
    <v-window v-model="selected" class="flex-grow-1">
      <v-window-item v-for="rank in $chat.editingChat.ranks" :value="rank.id">
        {{ rank.id }}
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";

export default defineComponent({
  name: "ChatSettingsRanks",
  components: { GraphWidget, UserAvatar, Overline },
  data() {
    return {
      selected: "admin"
    };
  },
  computed: {
    selectedRank() {
      return this.$chat.editingChat.ranks.find((rank) => {
        return rank.id === this.selected;
      });
    }
  }
});
</script>

<style scoped></style>
