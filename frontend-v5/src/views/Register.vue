<template>
  <div class="flex justify-center items-center h-[calc(100vh-64px)]">
    <card
      style="outline: none; border: none; min-width: 400px; max-height: 400px"
      :padding="false"
      class="flex flex-col justify-center m-10"
    >
      <div class="flex flex-col justify-center items-center px-4 pt-4">
        <h2>Register to Flowinity</h2>
        <p class="text-medium-emphasis-dark pb-1">
          Join Flowinity, the ultimate online collaboration platform.
        </p>
        <text-field
          v-model="username"
          :label="t('login.username')"
          @keydown.enter="login"
          class="w-full"
          autofocus
        ></text-field>
        <text-field
          v-model="email"
          :label="t('login.email')"
          @keydown.enter="login"
          class="w-full"
        ></text-field>
        <text-field
          v-model="password"
          :label="t('login.password')"
          type="password"
          @keydown.enter="login"
          class="w-full"
        ></text-field>
      </div>
      <div class="w-full px-4 py-2">
        <tpu-checkbox class="w-full" v-model="termsAccepted">
          <template #label>
            I agree with the
            <router-link class="text-blue" to="/legal/terms">
              Terms of Service
            </router-link>
            and the
            <router-link class="text-blue" to="/legal/privacy">
              Privacy Policy
            </router-link>
          </template>
        </tpu-checkbox>
      </div>
      <div class="px-4 pt-1 pb-4">
        <a class="text-blue cursor-pointer" @click="$emit('login')">
          Already have an account? Login
        </a>
      </div>
      <card-actions>
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
import { LoginMutation } from "@/graphql/auth/login.graphql";
import { useRouter } from "vue-router";
import { RegisterMutation } from "@/graphql/auth/register.graphql";
import TpuCheckbox from "@/components/Framework/Input/TpuCheckbox.vue";

const { t } = useI18n();
const appStore = useAppStore();
const username = ref("");
const password = ref("");
const email = ref("");
const loading = ref(false);
const termsAccepted = ref(false);
const router = useRouter();
defineEmits(["login"]);

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
