<template>
  <div class="chat-demo">
    <DynamicScroller
      ref="scroller"
      :items="$chat.selectedChat?.messages"
      :min-item-size="54"
      class="scroller"
      v-if="$chat.selectedChat?.messages?.length"
      height="100%"
      style="height: 100%"
      :item-size="null"
      page-mode
    >
      <template #before>
        <div class="notice">The message heights are unknown.</div>
      </template>

      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.content, item.embeds]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          class="message"
          @click="changeMessage(item)"
        >
          <Message
            :id="'message-' + index"
            :key="item.id"
            :class="{ 'replying-message': item.id === replyId }"
            :date-separator="dateSeparator(index)"
            :editing="editing === item.id"
            :editingText="editingText"
            :merge="$chat.merge(item, index)"
            :message="item"
            @authorClick="
              $chat.dialogs.userMenu.user = $event.user;
              $chat.dialogs.userMenu.username = $event.user.username;
              $chat.dialogs.userMenu.bindingElement = $event.bindingElement;
              $chat.dialogs.userMenu.x = $event.x;
              $chat.dialogs.userMenu.y = $event.y;
              $chat.dialogs.userMenu.location = $event.location || 'top';
            "
            @delete="
              $event.shifting
                ? deleteMessage($event.message.id)
                : confirmDelete($event.message)
            "
            @edit="handleEdit"
            @editMessage="doEditMessage"
            @editText="editingText = $event"
            @jumpToMessage="$chat.jumpToMessage($event)"
            @reply="replyId = $event.id"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Message from "@/components/Communications/Message.vue";
export default {
  data() {
    return {
      search: "",
      editingText: "",
      editing: false,
      replyId: null,
      streaming: false
    };
  },
  components: {
    Message
  },

  unmounted() {
    this.stopStream();
  },

  methods: {
    scrollToBottom() {
      this.$refs.scroller.scrollToBottom();
    },

    stopStream() {
      this.streaming = false;
    },
    deleteMessage() {},
    confirmDelete() {},
    handleEdit() {},
    doEditMessage() {},
    dateSeparator() {},
    changeMessage() {}
  }
};
</script>

<style>
.chat-demo {
  overflow: hidden;
  flex: auto 1 1;
  display: flex;
  flex-direction: column-reverse;
}

.scroller {
  flex: auto 1 1;
}

.message {
  color: inherit !important;
}
</style>
