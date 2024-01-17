<template>
  <div>
    <LoginDialog
      v-model="loginDialog"
      @register="
        loginDialog = false;
        registerDialog = true;
      "
    />
    <RegisterDialog
      v-model="registerDialog"
      @login="
        loginDialog = true;
        registerDialog = false;
      "
    />
    <div class="absolute right-0">
      <div class="flex p-12">
        <tpu-button @click="loginDialog = true">Login</tpu-button>
      </div>
    </div>
    <div class="flex justify-between items-center h-[calc(100vh-64px)]">
      <card
        style="background: transparent; outline: none; border: none"
        :padding="false"
        class="flex flex-col justify-center items-center pl-10"
      >
        <div
          class="flex flex-col p-4 justify-center items-center"
          style="max-width: 400px"
        >
          <transition name="slide-y-transition" mode="out-in">
            <h1 class="text-6xl font-bold" :key="slogan">
              {{ slogan }}
            </h1>
          </transition>
          <p class="text-center my-4 text-2xl">
            Join Flowinity, the free next generation online collaboration
            platform.
          </p>
          <tpu-button
            color="blue"
            style="height: 40px; line-height: 30px"
            @click="registerDialog = true"
          >
            Get Started Now
          </tpu-button>
        </div>
      </card>
      <div class="flex justify-center m-10">
        <tpu-img
          src="https://i.troplo.com/i/debc2a79dd5d.png"
          style=""
          image-classes="mb-8 border-outline-dark border-2 rounded-xl glowing-img"
          :style="{
            transform: `rotateX(${-mouseY / 100}deg) rotateY(${
              mouseX / 100
            }deg) translateZ(30px)`
          }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";
import Card from "@/components/Framework/Card/Card.vue";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import Login from "@/views/Login.vue";
import LoginDialog from "@/components/Auth/LoginDialog.vue";
import RegisterDialog from "@/components/Auth/RegisterDialog.vue";
import { useRoute } from "vue-router";

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

setInterval(() => {
  slogan.value = slogans[(slogans.indexOf(slogan.value) + 1) % slogans.length];
}, 4000);

const mouseX = ref(0);
const mouseY = ref(0);

window.addEventListener("mousemove", (event) => {
  mouseX.value = event.clientX - window.innerWidth / 2;
  mouseY.value = event.clientY - window.innerHeight / 2;
});

const loginDialog = ref(false);
const registerDialog = ref(false);
const route = useRoute();

onMounted(() => {
  switch (route.query.action) {
    case "login":
      loginDialog.value = true;
      break;
    case "register":
      registerDialog.value = true;
      break;
  }
});
</script>

<style scoped></style>
