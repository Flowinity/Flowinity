<template>
  <CoreDialog
    :model-value="modelValue"
    style="max-width: 548px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Friend Nickname</template>
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
      <v-spacer></v-spacer>
      <v-btn :loading="loading" color="primary" @click="update">Update</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "NicknameDialog",
  components: { CoreDialog },
  emits: ["update:modelValue", "upload"],
  props: ["modelValue"],
  data() {
    return {
      nickname: "",
      loading: false
    };
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
  },
  watch: {
    modelValue() {
      this.nickname =
        this.$friends.getName(this.$app.dialogs.nickname.userId, true) || "";
    }
  }
});
</script>
