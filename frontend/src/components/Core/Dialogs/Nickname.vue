<template>
  <CoreDialog
    :model-value="modelValue"
    style="max-width: 548px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Friend Nickname</template>
    <v-card-text>
      <v-text-field
        v-model="nickname"
        :autofocus="true"
        label="Nickname"
        outlined
        @keydown.enter="update"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :loading="loading" color="primary" @click="update">Update</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue", "upload"],
  data() {
    return {
      nickname: "",
      loading: false
    };
  },
  watch: {
    modelValue() {
      this.nickname =
        this.$friends.getName(this.$app.dialogs.nickname.userId, true) || "";
    }
  },
  methods: {
    async update() {
      this.loading = true;
      await this.axios.patch(
        `/user/nickname/${this.$app.dialogs.nickname.userId}`,
        {
          nickname: this.nickname
        }
      );
      this.loading = false;
      this.$emit("update:modelValue", false);
    }
  }
});
</script>
