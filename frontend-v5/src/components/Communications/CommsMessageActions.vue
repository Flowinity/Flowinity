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
      >
        <template v-slot="{ open }">
          <tpu-button
            variant="passive"
            icon
            class="rounded-none"
            @click="open()"
          >
            <component
              :is="message.pinned ? RiPushpinFill : RiPushpinLine"
              style="width: 20px"
            />
          </tpu-button>
        </template>
      </tpu-confirmation-dialog>

      <tpu-button variant="passive" icon class="rounded-none">
        <RiEditLine style="width: 20px" />
      </tpu-button>
      <tpu-button color="red" variant="passive" icon class="rounded-none">
        <RiDeleteBinLine style="width: 20px" />
      </tpu-button>
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
import { Message } from "@/gql/graphql";
import { PropType } from "vue";
import TpuConfirmationDialog from "@/components/Framework/Dialog/TpuConfirmationDialog.vue";

defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true
  }
});

defineEmits(["reply", "pin"]);
</script>
