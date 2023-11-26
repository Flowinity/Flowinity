<template>
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
        <p class="text-center mt-4 text-2xl">
          Join Flowinity, the free next generation online collaboration
          platform.
        </p>
      </div>
    </card>
    <div
      style="outline: none; border: none; max-height: 500px"
      :padding="false"
      class="flex flex-col justify-center m-10"
    >
      <tpu-img
        src="https://dummyimage.com/3840x2035/0e0f11/ffffff.png&text=placeholder"
        style="max-width: 512px"
        image-classes="mb-8 border-outline-dark border-2 rounded-xl glowing-img"
        :style="{
          transform: `rotateX(${-mouseY / 100}deg) rotateY(${
            mouseX / 100
          }deg) translateZ(30px)`
        }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import TpuImg from "@/components/Framework/Image/TpuImg.vue";
import Card from "@/components/Framework/Card/Card.vue";
import CardActions from "@/components/Framework/Card/CardActions.vue";
import TextField from "@/components/Framework/Input/TextField.vue";

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
</script>

<style scoped></style>
