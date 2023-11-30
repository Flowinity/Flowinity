<template>
  <card padding class="my-4 mx-4">
    <div class="flex flex-col gap-3">
      <strong class="ml-1">
        {{ t("settings.account.title") }}
      </strong>

      <tpu-expansion-panel>
        <template #header>{{ t("settings.account.username.title") }}</template>
        <div>
          <text-field
            v-model="username.attrs.username"
            :label="t('settings.account.username.newUsername')"
          />
          <danger-zone-input
            v-model:password-mode="username.passwordMode"
            v-model:password="username.password"
            v-model:totp="username.totp"
          />
        </div>
        <card-actions>
          <tpu-button>
            {{ $t("generic.update") }}
          </tpu-button>
        </card-actions>
      </tpu-expansion-panel>
      <tpu-expansion-panel>
        <template #header>
          {{ t("settings.account.password.title") }}
        </template>
        <div>
          <text-field
            v-model="password.attrs.password"
            :label="t('settings.account.password.newPassword')"
          />
          <text-field
            v-model="password.attrs.confirmPassword"
            :label="t('settings.account.password.confirmNewPassword')"
          />
          <danger-zone-input
            v-model:password="password.password"
            :password-mode="true"
          />
        </div>
        <card-actions>
          <tpu-button>
            {{ $t("generic.update") }}
          </tpu-button>
        </card-actions>
      </tpu-expansion-panel>
      <tpu-expansion-panel>
        <template #header>
          {{ t("settings.account.email.title") }}
        </template>
        <div>
          <text-field
            v-model="password.attrs.email"
            :label="t('settings.account.email.newEmail')"
          />
          <danger-zone-input
            v-model:password-mode="email.passwordMode"
            v-model:password="email.password"
            v-model:totp="email.totp"
          />
        </div>
        <card-actions>
          <tpu-button>
            {{ $t("generic.update") }}
          </tpu-button>
        </card-actions>
      </tpu-expansion-panel>
    </div>
    <div class="flex flex-col gap-3 mt-4 mx-1">
      <strong>
        {{ t("settings.preferences.title") }}
      </strong>

      <tpu-slider
        v-model="userStore.user!.itemsPerPage"
        :label="t('settings.preferences.itemsPerPage')"
        :step="12"
        :min="12"
        :max="72"
        @update:model-value="userStore.updateUser()"
      />
      <tpu-select
        v-model="userStore.user!.weatherUnit"
        :items="tempOptions"
        :label="t('settings.preferences.weatherUnit')"
        @update:model-value="userStore.updateUser()"
      />
      <tpu-select
        v-model="userStore.user!.language"
        :items="languages"
        :label="t('settings.preferences.language')"
        @update:model-value="userStore.updateUser()"
      />
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useI18n } from "vue-i18n";
import TpuExpansionPanel from "@/components/Framework/ExpansionPanel/TpuExpansionPanel.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref } from "vue";
import { DangerZone } from "@/classes/DangerZone";
import { useUserStore } from "@/stores/user.store";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import TpuSlider from "@/components/Framework/Input/TpuSlider.vue";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { useApolloClient } from "@vue/apollo-composable";
import {
  ChangeUserEmailMutation,
  ChangeUsernameMutation,
  ChangeUserPasswordMutation
} from "@/graphql/user/changeUsername.graphql";
import { useToast } from "vue-toastification";
const userStore = useUserStore();
const username = ref(
  new DangerZone<{ username: string }>(userStore.user?.totpEnable, {
    username: ""
  })
);
const password = ref(
  new DangerZone<{ password: string; confirmPassword: string }>(
    userStore.user?.totpEnable,
    {
      password: "",
      confirmPassword: ""
    }
  )
);
const email = ref(
  new DangerZone<{ email: string }>(userStore.user?.totpEnable, {
    email: ""
  })
);
const { t } = useI18n();
const tempOptions = [
  {
    id: "celsius",
    name: t("settings.preferences.temp.celsius")
  },
  {
    id: "fahrenheit",
    name: t("settings.preferences.temp.fahrenheit")
  },
  {
    id: "kelvin",
    name: t("settings.preferences.temp.kelvin")
  }
];
const languages = [
  {
    id: "en",
    name: t("settings.preferences.languages.en")
  }
];
const toast = useToast();

async function changeEmail() {
  await this.$apollo.mutate({
    mutation: ChangeUserEmailMutation,
    variables: {
      input: {
        email: email.value.attrs.email,
        password: email.value.passwordMode ? email.value.password : undefined,
        totp: email.value.passwordMode ? undefined : email.value.totp
      }
    }
  });
  userStore.user!.email = email.value.attrs.email;
  userStore.user!.emailVerified = false;
}

async function changePassword() {
  if (password.value.attrs.password !== password.value.attrs.confirmPassword) {
    return toast.error("Password doesn't match.");
  }
  await useApolloClient().client.mutate({
    mutation: ChangeUserPasswordMutation,
    variables: {
      input: {
        newPassword: password.value.attrs.password,
        currentPassword: password.value.password
      }
    }
  });
}
async function changeUsername() {
  await useApolloClient().client.mutate({
    mutation: ChangeUsernameMutation,
    variables: {
      input: {
        username: username.value.attrs.username,
        password: username.value.passwordMode
          ? username.value.password
          : undefined,
        totp: username.value.passwordMode ? undefined : username.value.totp
      }
    }
  });
  toast.success("Your username has been updated!");
}
</script>

<style scoped></style>
