<template>
  <v-menu
    :close-on-content-click="false"
    v-model="active"
    location="end"
    style="z-index: 4001"
  >
    <template v-slot:activator="{ props }">
      <v-chip class="ml-2 my-1" v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-chip>
    </template>
    <v-card>
      <v-card-title class="text-h6">
        {{ $t("chats.settings.ranks.add.title") }}
      </v-card-title>
      <v-card-subtitle>
        {{ $t("chats.settings.ranks.add.description") }}
      </v-card-subtitle>
      <v-list max-height="400">
        <v-text-field
          v-model="search"
          :autofocus="true"
          class="mx-5 my-n1"
          label="Search"
        ></v-text-field>
        <v-list-item
          v-for="rank in ranksSearch"
          :active="association.ranksMap.includes(rank.id)"
          :value="rank.id"
          :key="rank.id"
          :disabled="
            rank.managed || !$chat.canEditRank(rank.index, $chat.editingChat)
          "
          @click="
            $chat.toggleUserRank(association.id, currentAssociationId, rank.id)
          "
        >
          <template v-slot:prepend>
            <v-avatar
              class="v-avatar--variant-outlined pointer"
              :color="rank.color"
              size="22"
            ></v-avatar>
          </template>
          <template v-slot:append>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="association.ranksMap.includes(rank.id)"
                color="primary"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ rank.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Friend } from "@/models/friend";
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { ChatAssociation, ChatRank } from "@/gql/graphql";
import { ToggleUserRankMutation } from "@/graphql/chats/toggleUserRank.graphql";

export default defineComponent({
  name: "AddRole",
  components: { UserAvatar },
  props: {
    ranks: {
      type: Object as () => ChatRank,
      required: true
    },
    association: {
      type: Object as () => ChatAssociation,
      required: true
    },
    currentAssociationId: {
      type: Number,
      required: true
    }
  },
  emits: ["add"],
  data() {
    return {
      active: false,
      search: "",
      selected: [] as number[]
    };
  },
  methods: {},
  computed: {
    ranksSearch() {
      return this.ranks.filter((rank: ChatRank) =>
        rank.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
});
</script>

<style scoped></style>
