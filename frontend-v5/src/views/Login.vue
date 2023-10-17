<template>
  <div class="flex justify-center items-center h-[calc(100vh-64px)]">
    <card :padding="false">
      <div class="flex flex-col justify-center items-center p-4">
        <img src="@/assets/flowinity.svg" style="width: 64px" />
        <p class="mt-2">alpha</p>
        <text-field
          v-model="username"
          :label="t('login.username')"
          @keydown.enter="login"
        ></text-field>
        <text-field
          v-model="password"
          :label="t('login.password')"
          type="password"
          @keydown.enter="login"
        ></text-field>
        <text-field
          type="number"
          v-model="totp"
          :label="t('login.totp')"
          :minlength="!totp.length ? undefined : 6"
          @keydown.enter="login"
        ></text-field>
      </div>
      <card-actions double>
        <template #start>
          <tpu-button color="white" to="/register">Register</tpu-button>
        </template>
        <tpu-button :loading="loading" color="blue" @click="login">
          Login
        </tpu-button>
      </card-actions>
    </card>
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/Core/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import TextField from "@/components/Core/Input/TextField.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CardActions from "@/components/Core/Card/CardActions.vue";
import TpuButton from "@/components/Core/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { LoginMutation } from "@/graphql/auth/login.graphql";
import { useRouter } from "vue-router";

const { t } = useI18n();
const appStore = useAppStore();
const username = ref("");
const password = ref("");
const totp = ref("");
const loading = ref(false);
const router = useRouter();

async function login() {
  try {
    loading.value = true;
    const {
      data: { login }
    } = await useApolloClient().client.mutate({
      mutation: LoginMutation,
      variables: {
        input: {
          username: username.value,
          password: password.value,
          totp: totp.value
        }
      }
    });

    localStorage.setItem("token", login.token);
    await appStore.init();
    await router.push("/");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
