<template>
  <card
    :secondary="true"
    :padding="false"
    class="absolute right-0 -top-5 message-actions"
  >
    <div class="flex">
      <tpu-button color="indigo" variant="passive" icon class="rounded-none">
        <RiPushpinLine style="width: 20px" />
      </tpu-button>
      <tpu-button variant="passive" icon class="rounded-none">
        <RiEditLine style="width: 20px" />
      </tpu-button>
      <tpu-button color="red" variant="passive" icon class="rounded-none">
        <RiDeleteBinLine style="width: 20px" />
      </tpu-button>
      <tpu-button variant="passive" icon class="rounded-none">
        <RiReplyLine style="width: 20px" />
      </tpu-button>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Core/Card/Card.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import RiEditLine from "vue-remix-icons/icons/ri-edit-line.vue";
import RiDeleteBinLine from "vue-remix-icons/icons/ri-delete-bin-line.vue";
import RiReplyLine from "vue-remix-icons/icons/ri-reply-line.vue";
import RiPushpinLine from "vue-remix-icons/icons/ri-pushpin-line.vue";
</script>

<style scoped></style>
