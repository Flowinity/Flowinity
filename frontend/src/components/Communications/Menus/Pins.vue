<template>
  <v-menu
    max-width="650"
    max-height="500"
    width="400"
    @update:model-value="getPins"
    :close-on-content-click="false"
    activator="parent"
    class="rounded-xl"
    style="z-index: 2001"
    location="bottom center"
  >
    <v-card>
      <v-toolbar>
        <v-spacer></v-spacer>
        Pins
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-progress-linear
        indeterminate
        size="64"
        v-if="loading"
        :model-value="true"
      ></v-progress-linear>
      <v-container>
        <v-list v-if="data.messages.length">
          <Message
            class="pointer"
            @click="$chat.jumpToMessage(message.id)"
            v-for="(message, index) in data.messages"
            :key="message.id"
            :message="message"
            :id="'message-' + index"
            @authorClick="
              $chat.dialogs.userMenu.user = $event.user;
              $chat.dialogs.userMenu.username = $event.user.username;
              $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
              $chat.dialogs.userMenu.x = $event.x;
              $chat.dialogs.userMenu.y = $event.y;
              $chat.dialogs.userMenu.location = $event.location || 'top';
            "
            @jumpToMessage="$chat.jumpToMessage($event.id)"
            :search="true"
            :pins="true"
            @refresh="getPins(true)"
          />
        </v-list>
        <PromoNoContent
          v-else
          icon="mdi-pin-outline"
          title="No pins"
          description="Pinned messages will appear here."
        />
        <Paginate
          v-model="page"
          class="mt-2"
          v-if="data.pager.totalPages > 1"
          :total-pages="data.pager.totalPages"
        ></Paginate>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Message as MessageType } from "@/models/message";
import { Paginate as PaginateType } from "@/types/paginate";
import Message from "@/components/Communications/Message.vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import Paginate from "@/components/Core/Paginate.vue";

export default defineComponent({
  name: "Pins",
  components: { Paginate, PromoNoContent, Message },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      page: 1,
      loading: false,
      data: {
        messages: [] as MessageType[],
        pager: {} as PaginateType
      }
    };
  },
  methods: {
    async getPins(e: boolean) {
      if (!e) return;
      this.loading = true;
      const { data } = await this.axios.get(
        `/chats/${this.$chat.selectedChatId}/messages`,
        {
          params: {
            page: this.page,
            mode: "paginate",
            type: "pins"
          }
        }
      );
      this.data = data;
      this.loading = false;
    }
  },
  watch: {
    page() {
      this.getPins(true);
    }
  }
});
</script>

<style scoped></style>
