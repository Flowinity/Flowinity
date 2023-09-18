<template>
  <CreateRank
    v-model="createRank"
    :association-id="$chat.editingChat.association.id"
  ></CreateRank>
  <overline position="center">
    {{ selectedRank?.name || $t("chats.settings.ranks.name") }}
  </overline>
  <div class="d-flex flex-grow-1">
    <v-tabs direction="vertical" v-model="selected">
      <VueDraggable
        @end="updateRankOrder"
        v-model="$chat.editingChat.ranks"
        item-key="id"
        class="v-slide-group v-slide-group--vertical v-tabs v-tabs--vertical v-tabs--align-tabs-start v-tabs--density-default d-flex"
        handle=".drag-handle"
      >
        <v-tab
          v-for="rank in $chat.editingChat.ranks"
          :value="rank.id"
          :color="rank.color"
          item-key="id"
        >
          <div class="d-flex justify-space-between align-center">
            <v-avatar
              class="v-avatar--variant-outlined pointer mr-2"
              :color="rank.color"
              size="10"
            ></v-avatar>
            {{ rank.name }}
            <div>
              <v-icon class="float-right" v-if="rank.managed">mdi-lock</v-icon>
              <v-icon class="drag-handle mr-3 ml-1" v-else>mdi-drag</v-icon>
            </div>
          </div>
        </v-tab>
      </VueDraggable>
      <v-btn @click="createRank = true">
        <v-icon class="mr-2">mdi-plus</v-icon>
        {{ $t("chats.settings.ranks.manage.create") }}
      </v-btn>
    </v-tabs>
    <v-window v-model="selected" class="flex-grow-1" :touch="false">
      <v-window-item v-for="rank in $chat.editingChat.ranks" :value="rank.id">
        <v-container class="d-flex justify-center text-center">
          <div>
            <v-card-title>
              {{ $t("chats.settings.ranks.manage.color") }}
            </v-card-title>
            <v-color-picker v-model="rank.color" mode="hexa"></v-color-picker>
          </div>
          <div class="ml-10">
            <v-card-title>
              {{ $t("chats.settings.ranks.manage.name") }}
            </v-card-title>
            <v-card-subtitle style="white-space: initial" class="mb-4">
              {{ $t("chats.settings.ranks.manage.nameDesc") }}
            </v-card-subtitle>
            <v-text-field
              :label="$t('chats.settings.ranks.manage.name')"
              v-model="rank.name"
            ></v-text-field>
            <v-btn
              block
              @click="updateRank(rank)"
              :loading="$chat.dialogs.groupSettings.loading"
            >
              Save
            </v-btn>
          </div>
        </v-container>
        <v-list-item-subtitle v-if="rank.managed">
          This rank is special, it's automatically assigned to new users upon
          joining and cannot be deleted.
        </v-list-item-subtitle>
        <v-list v-for="group in transformed" :key="group.name">
          <overline position="start">
            {{ $t(`chats.settings.ranks.manage.groups.${group.name}`) }}
          </overline>
          <v-list-item v-for="item in group.items" :key="item.id">
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.description }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-switch
                density="compact"
                :model-value="hasPermission(rank.permissionsMap, item.id)"
                @update:model-value="updateRank(rank, item.id, $event)"
              ></v-switch>
            </template>
          </v-list-item>
        </v-list>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  AvailableChatPermissionsDocument,
  Chat,
  ChatPermission,
  ChatRank
} from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";
import {
  UpdateRankMutation,
  UpdateRankOrderMutation
} from "@/graphql/chats/updateRank.graphql";
import { VueDraggable } from "vue-draggable-plus";
import CreateRank from "@/components/Communications/Dialogs/CreateRank.vue";

export default defineComponent({
  name: "ChatSettingsRanks",
  components: { CreateRank, VueDraggable, GraphWidget, UserAvatar, Overline },
  data() {
    return {
      selected: "admin",
      availablePermissions: [] as ChatPermission[],
      createRank: false
    };
  },
  computed: {
    transformed() {
      return this.availablePermissions.reduce((result, currentObj) => {
        const groupName = currentObj.group;
        const existingGroup = result.find((group) => group.name === groupName);

        if (existingGroup) {
          existingGroup.items.push(currentObj);
        } else {
          result.push({
            name: groupName,
            items: [currentObj]
          });
        }

        return result;
      }, []);
    },
    selectedRank() {
      return this.$chat.editingChat.ranks.find((rank) => {
        return rank.id === this.selected;
      });
    }
  },
  methods: {
    async updateRankOrder() {
      await this.$apollo.mutate({
        mutation: UpdateRankOrderMutation,
        variables: {
          input: {
            associationId: this.$chat.editingChat.association.id,
            rankIds: this.$chat.editingChat.ranks.map((rank) => rank.id)
          }
        }
      });
    },
    async updateRank(rank: ChatRank, permission?: string, add?: boolean) {
      const permissionsMap = add
        ? [...rank.permissionsMap, permission]
        : rank.permissionsMap.filter((id) => id !== permission);
      await this.$apollo.mutate({
        mutation: UpdateRankMutation,
        variables: {
          input: {
            permissionsMap,
            associationId: this.$chat.editingChat.association.id,
            rankId: rank.id,
            name: rank.name,
            color: rank.color
          }
        }
      });
    },
    hasPermission(permissionsMap: string[], id: string) {
      return permissionsMap.includes(id);
    },
    async getRanks() {
      const {
        data: { availableChatPermissions }
      } = await this.$apollo.query({
        query: AvailableChatPermissionsDocument
      });
      this.availablePermissions = availableChatPermissions;
    }
  },
  mounted() {
    this.getRanks();
  }
});
</script>

<style scoped></style>
