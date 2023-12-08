<template>
  <card
    style="outline: none; border: none; min-width: 400px; max-height: 400px"
    :padding="false"
    class="flex flex-col justify-center m-10"
  >
    <div class="flex flex-col justify-center items-center px-4 pt-4">
      <h2>Login to Flowinity</h2>
      <text-field
        v-model="username"
        :label="t('login.username')"
        @keydown.enter="login"
        class="w-full"
        autofocus
      ></text-field>
      <text-field
        v-model="password"
        :label="t('login.password')"
        type="password"
        @keydown.enter="login"
        class="w-full"
      ></text-field>
      <text-field
        type="number"
        v-model="totp"
        :label="t('login.totp')"
        :minlength="!totp.length ? undefined : 6"
        @keydown.enter="login"
        class="w-full"
      ></text-field>
    </div>
    <div class="px-4 pt-1 pb-4">
      <a class="text-blue cursor-pointer" @click="$emit('register')">
        Don't have an account? Register
      </a>
    </div>
    <card-actions>
      <tpu-button :loading="loading" color="blue" @click="login">
        Login
      </tpu-button>
    </card-actions>
  </card>
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
import { useUserStore } from "@/stores/user.store";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";

const { t } = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();
const username = ref("");
const password = ref("");
const totp = ref("");
const loading = ref(false);
const router = useRouter();
const slogan = ref("Chat.");
const slogans = [
  "Chat.",
  "Share.",
  "Upload.",
  "Collaborate.",
  "Work.",
  "Play.",
  "Flowinity."
];
const emit = defineEmits(["register"]);

setInterval(() => {
  slogan.value = slogans[(slogans.indexOf(slogan.value) + 1) % slogans.length];
}, 4000);

const mouseX = ref(0);
const mouseY = ref(0);

window.addEventListener("mousemove", (event) => {
  mouseX.value = event.clientX - window.innerWidth / 2;
  mouseY.value = event.clientY - window.innerHeight / 2;
});

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

    userStore.token = login.token;
    localStorage.setItem("token", login.token);
    await appStore.init();
    await router.push("/");
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.glowing-img {
}
</style>
