<template>
  <slot :open="() => (open = true)"></slot>
  <tpu-dialog v-model="open">
    <template #toolbar>
      {{ title }}
    </template>
    <p class="m-2">
      {{ content }}
    </p>
    <card-actions>
      <tpu-button variant="passive" @click="open = false">
        {{ cancel }}
      </tpu-button>
      <tpu-button
        :color="buttonColor"
        variant="passive"
        @click="
          $emit('onConfirm');
          open = false;
        "
      >
        {{ confirm }}
      </tpu-button>
    </card-actions>
  </tpu-dialog>
</template>
<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { useI18n } from "vue-i18n";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { ref } from "vue";
import CardActions from "@/components/Framework/Card/CardActions.vue";

const open = ref(false);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  confirm: {
    type: String,
    default: "Confirm"
  },
  cancel: {
    type: String,
    default: "Cancel"
  },
  buttonColor: {
    type: String,
    default: "red"
  }
});

defineEmits(["onConfirm"]);
</script>
