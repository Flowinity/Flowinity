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
          v-model="email"
          :label="t('login.email')"
          @keydown.enter="login"
        ></text-field>
        <text-field
          v-model="password"
          :label="t('login.password')"
          type="password"
          @keydown.enter="login"
        ></text-field>
      </div>
      <card-actions double>
        <template #start>
          <tpu-button color="white" to="/login">Login</tpu-button>
        </template>
        <tpu-button :loading="loading" color="blue" @click="login">
          Register
        </tpu-button>
      </card-actions>
    </card>
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useAppStore } from "@/stores/app.store";
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { RegisterMutation } from "@/graphql/auth/register.graphql";

const { t } = useI18n();
const appStore = useAppStore();
const username = ref("");
const password = ref("");
const email = ref("");
const loading = ref(false);
const router = useRouter();

async function login() {
  try {
    loading.value = true;
    const {
      data: { register }
    } = await useApolloClient().client.mutate({
      mutation: RegisterMutation,
      variables: {
        input: {
          username: username.value,
          password: password.value,
          email: email.value
        }
      }
    });

    localStorage.setItem("token", register.token);
    await appStore.init();
    await router.push("/");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
