<template>
  <card
    :secondary="true"
    :padding="false"
    class="absolute right-0 -top-5 message-actions"
  >
    <div class="flex">
      <tpu-confirmation-dialog
        :title="
          $t(
            `chats.actions.${
              message.pinned ? 'unpinConfirm' : 'pinConfirm'
            }.title`
          )
        "
        :content="
          $t(
            `chats.actions.${
              message.pinned ? 'unpinConfirm' : 'pinConfirm'
            }.content`
          )
        "
        @on-confirm="$emit('pin', !message.pinned)"
        button-color="blue"
        v-if="chatStore.hasPermission(ChatPermissions.PIN_MESSAGES)"
      >
        <template v-slot="{ open }">
          <tpu-button
            variant="passive"
            icon
            class="rounded-none"
            @click="$event.shiftKey ? $emit('pin', !message.pinned) : open()"
          >
            <component
              :is="message.pinned ? RiPushpinFill : RiPushpinLine"
              style="width: 20px"
            />
          </tpu-button>
        </template>
      </tpu-confirmation-dialog>

      <tpu-button
        variant="passive"
        icon
        class="rounded-none"
        v-if="message.userId === userStore.user?.id && !systemMessage"
        @click="$emit('edit')"
      >
        <RiEditLine style="width: 20px" />
      </tpu-button>
      <tpu-confirmation-dialog
        :title="$t(`chats.actions.deleteConfirm.title`)"
        :content="$t(`chats.actions.deleteConfirm.content`)"
        @on-confirm="messagesStore.deleteMessage(message.id)"
        button-color="red"
        :confirm="$t(`generic.delete`)"
        v-if="
          chatStore.hasPermission(ChatPermissions.DELETE_MESSAGES) ||
          (message.userId === userStore.user?.id && !systemMessage)
        "
      >
        <template v-slot="{ open }">
          <tpu-button
            color="red"
            variant="passive"
            icon
            class="rounded-none"
            @click="
              $event.shiftKey ? messagesStore.deleteMessage(message.id) : open()
            "
          >
            <RiDeleteBinLine style="width: 20px" />
          </tpu-button>
        </template>
      </tpu-confirmation-dialog>
      <tpu-button
        variant="passive"
        icon
        class="rounded-none"
        @click="$emit('reply')"
      >
        <RiReplyLine style="width: 20px" />
      </tpu-button>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiEditLine from "vue-remix-icons/icons/ri-edit-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiReplyLine from "vue-remix-icons/icons/ri-reply-line.vue";
import RiPushpinLine from "vue-remix-icons/icons/ri-pushpin-line.vue";
import RiPushpinFill from "vue-remix-icons/icons/ri-pushpin-fill.vue";
import { Message, MessageType } from "@/gql/graphql";
import { computed, PropType, ref } from "vue";
import TpuConfirmationDialog from "@/components/Framework/Dialog/TpuConfirmationDialog.vue";
import { useChatStore } from "@/stores/chat.store";
import { useMessagesStore } from "@/stores/messages.store";
import { useUserStore } from "@/stores/user.store";
import { ChatPermissions } from "@/components/Workspaces/EditorV2/Core/typescache/tpu-typecache";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true
  }
});

defineEmits(["reply", "pin", "edit"]);

const messagesStore = useMessagesStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const systemMessage = computed(() => {
  return props.message.type !== MessageType.Message && props.message.type;
});
</script>
