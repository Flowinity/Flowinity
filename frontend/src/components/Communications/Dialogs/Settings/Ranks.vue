<template>
  <CreateRank
    v-model="createRank"
    :association-id="$chat.editingChat.association.id"
  ></CreateRank>
  <overline position="center">
    {{ selectedRank?.name || $t("chats.settings.ranks.name") }}
  </overline>
  <div
    class="d-flex flex-grow-1"
    :class="{ 'flex-column': $vuetify.display.mobile }"
  >
    <v-tabs
      :direction="$vuetify.display.mobile ? 'horizontal' : 'vertical'"
      v-model="selected"
    >
      <VueDraggable
        @end="updateRankOrder"
        v-model="$chat.editingChat.ranks"
        item-key="id"
        class="v-slide-group v-slide-group--vertical v-tabs v-tabs--vertical v-tabs--align-tabs-start v-tabs--density-default d-flex"
        handle=".drag-handle"
      >
        <v-menu v-model="context" :style="menuStyle" location="end">
          <v-list>
            <v-list-item
              style="color: rgb(var(--v-theme-error))"
              @click="deleteRank(contextRank?.id)"
              :disabled="
                !$chat.canEditRank(contextRank?.index, $chat.editingChat)
              "
            >
              <v-icon>mdi-delete</v-icon>
              {{ $t("generic.delete") }}
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tab
          v-for="rank in $chat.editingChat.ranks"
          :value="rank.id"
          @contextmenu.prevent="
            contextY = $event.y;
            contextX = $event.x;
            contextRank = rank;
            context = true;
          "
          :color="rank.color"
          item-key="id"
          :id="`rank-${rank.id}`"
        >
          <div class="d-flex justify-space-between align-center">
            <v-avatar
              class="v-avatar--variant-outlined pointer mr-2"
              :color="rank.color"
              size="10"
            ></v-avatar>
            <div class="mr-3 ml-1">
              <v-icon
                v-if="
                  rank.managed ||
                  !$chat.canEditRank(rank.index, $chat.editingChat)
                "
              >
                mdi-lock
              </v-icon>
              <v-icon class="drag-handle" v-else>mdi-drag</v-icon>
            </div>
            {{ rank.name }}
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
        <v-container
          class="justify-center text-center"
          :class="{ 'd-flex': !$vuetify.display.mobile }"
        >
          <div>
            <v-card-title>
              {{ $t("chats.settings.ranks.manage.color") }}
            </v-card-title>
            <v-color-picker
              v-model="rank.color"
              mode="hexa"
              :disabled="!$chat.canEditRank(rank.index, $chat.editingChat)"
            ></v-color-picker>
          </div>
          <div class="ml-10">
            <v-card-title>
              {{ $t("chats.settings.ranks.manage.name") }}
            </v-card-title>
            <v-card-subtitle
              style="white-space: pre-line !important"
              class="mb-4"
            >
              {{ $t("chats.settings.ranks.manage.nameDesc") }}
            </v-card-subtitle>
            <v-text-field
              :disabled="!$chat.canEditRank(rank.index, $chat.editingChat)"
              :label="$t('chats.settings.ranks.manage.name')"
              v-model="rank.name"
            ></v-text-field>
            <v-btn
              block
              :disabled="!$chat.canEditRank(rank.index, $chat.editingChat)"
              @click="updateRank(rank)"
              :loading="$chat.dialogs.groupSettings.loading"
            >
              Save
            </v-btn>
          </div>
        </v-container>
        <v-list-item-subtitle class="ml-4" v-if="rank.managed">
          {{ $t("chats.settings.ranks.manage.managedRank") }}
        </v-list-item-subtitle>
        <v-list v-for="group in transformed" :key="group.name">
          <overline position="start">
            {{ $t(`chats.settings.ranks.manage.groups.${group.name}`) }}
          </overline>
          <span v-for="item in group.items" :key="item.id">
            <v-tooltip
              v-if="
                item.id === 'TRUSTED' &&
                $user.user?.id !== $chat.editingChat.userId
              "
              activator="parent"
              location="top"
            >
              {{ $t("chats.settings.ranks.manage.trustedUserDisabled") }}
            </v-tooltip>
            <v-list-item
              :disabled="
                (item.id === 'TRUSTED' &&
                  $user.user?.id !== $chat.editingChat.userId) ||
                !$chat.canEditRank(rank.index, $chat.editingChat)
              "
            >
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
          </span>
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
import { DeleteChatRankMutation } from "@/graphql/chats/deleteRank.graphql";

export default defineComponent({
  name: "ChatSettingsRanks",
  components: { CreateRank, VueDraggable, GraphWidget, UserAvatar, Overline },
  data() {
    return {
      selected: "admin",
      availablePermissions: [] as ChatPermission[],
      createRank: false,
      context: false,
      contextRank: undefined as ChatRank | undefined,
      contextY: 0,
      contextX: 0
    };
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextY}px;
        left: ${this.contextX}px;`;
    },
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
    async deleteRank(id: string) {
      await this.$apollo.mutate({
        mutation: DeleteChatRankMutation,
        variables: {
          input: {
            associationId: this.$chat.editingChat.association.id,
            rankId: id
          }
        }
      });
    },
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
      if (!permissionsMap) return false;
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
