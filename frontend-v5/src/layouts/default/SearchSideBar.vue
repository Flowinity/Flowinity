<template>
  <div class="p-2" v-if="query">
    <tpu-overline position="start">
      {{
        $t("chats.searchIn", {
          chat: chatStore.chatName(chatStore.selectedChat!),
          count: query.pager.totalItems
        })
      }}
    </tpu-overline>
    <div class="messages">
      <comms-message
        :search="true"
        v-for="message in query.items"
        :key="message.id"
        :message="message"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RiSearchLine from "vue-remix-icons/icons/ri-search-line.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useChatStore } from "@/stores/chat.store";
import TpuSmartTextField from "@/components/Framework/Input/TpuSmartTextField.vue";
import { useRoute } from "vue-router";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { PagedMessagesQuery } from "@/graphql/chats/messages.graphql";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import CommsMessage from "@/components/Communications/CommsMessage.vue";
const { t } = useI18n();
const chatStore = useChatStore();
import type { Message, Pager } from "@/gql/graphql";

const query = ref<{
  pager: Pager;
  items: Message[];
} | null>(null);
const apollo = useApolloClient();

async function getMessages() {
  const {
    data: { messagesPaged }
  } = await apollo.client.query({
    query: PagedMessagesQuery,
    variables: {
      input: {
        associationId: chatStore.selectedChatAssociationId,
        page: 1,
        search: { query: chatStore.uiOptions.search }
      }
    }
  });
  query.value = messagesPaged;
}

watch(
  () => chatStore.uiOptions.searchSidebar,
  async (value) => {
    if (value) {
      getMessages();
    }
  }
);

const route = useRoute();
watch(
  () => route.params.id,
  () => {
    chatStore.uiOptions.searchSidebar = false;
  }
);
</script>

<style scoped></style>
