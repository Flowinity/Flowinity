<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ blocked ? $t("dialogs.unblock.title") : $t("dialogs.block.title") }}
    </template>
    <template v-if="!blocked">
      <v-container>
        <v-card-text class="mb-n2">
          {{
            $t("dialogs.block.description", {
              name: $user.dialogs.block.username
            })
          }}
        </v-card-text>
        <v-switch
          v-model="$user.dialogs.block.silent"
          :label="$t('dialogs.block.silentMode')"
          class="ml-4"
        />
        <v-card-text class="mt-n8">
          {{ $t("dialogs.block.silentModeDesc") }}
        </v-card-text>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="$user.blockUser()">
          {{ $t("dialogs.block.action") }}
        </v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-container>
        <v-card-text>
          {{ $t("dialogs.unblock.description") }}
        </v-card-text>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" @click="$user.blockUser()">
          {{ $t("dialogs.unblock.action") }}
        </v-btn>
      </v-card-actions>
    </template>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {};
  },
  computed: {
    blocked() {
      return !!this.$user.blocked.find(
        (block) => block.blockedUserId === this.$user.dialogs.block.userId
      );
    }
  }
});
</script>
