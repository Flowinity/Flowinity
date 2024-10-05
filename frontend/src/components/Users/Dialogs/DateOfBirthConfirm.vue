<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    :persistent="!$user.user?.dateOfBirth"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ $t("dialogs.dateOfBirthConfirm.title") }}
    </template>
    <v-card-text>
      {{ $t("dialogs.dateOfBirthConfirm.description") }}
    </v-card-text>
    <DatePickerInput
      :label="$t('dialogs.dateOfBirthConfirm.label')"
      v-model="dateOfBirth"
      class="mx-4"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue"
        @click="confirmDOB()"
        :disabled="!dateOfBirth"
        :loading="loading"
      >
        {{ $t("dialogs.dateOfBirthConfirm.action") }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts" setup>
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { ref } from "vue";
import DatePickerInput from "@/components/Core/DatePickerInput.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(["update:modelValue"]);
const dateOfBirth = ref<Date | null>(null);
const apolloClient = useApolloClient();
const loading = ref(false);

const confirmDOB = async () => {
  loading.value = true;
  const { data } = await apolloClient.client.mutate({
    mutation: gql`
      mutation ConfirmDateOfBirth($dateOfBirth: String!) {
        confirmDateOfBirth(dateOfBirth: $dateOfBirth)
      }
    `,
    variables: {
      dateOfBirth: dateOfBirth.value
    }
  });
  emit("update:modelValue", false);
  loading.value = false;
};
</script>

<style scoped></style>
