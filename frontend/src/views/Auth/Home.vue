<template>
  <v-parallax
    dark
    id="main-parallax"
    src="../../assets/images/background.png"
    height="500"
  >
    <div class="d-flex flex-column fill-height justify-center align-center">
      <h1 class="">TPU</h1>
      <h4 class="text-center">
        TPU is a screenshot & file hosting suite with extra features such as
        chatting, document editing, and more.
      </h4>
      <br />
      <div>
        <v-btn
          class="rounded-xl"
          large
          to="/login"
          variant="outlined"
          color="white"
        >
          Login
        </v-btn>
      </div>
    </div>
  </v-parallax>
  <v-col>
    <p class="text-h4 justify-center text-center text-gradient">What's new?</p>
    <PromoCard
      title="Feature Update 2.1"
      image="https://i.troplo.com/i/aae2fb2c0cf8.png"
    >
      TPU 2.1 adds Workspaces, a new way to create and collaborate on documents
      and notes.
    </PromoCard>
    <br />
    <p class="text-h4 justify-center text-center text-gradient">Features</p>
    <PromoCard
      title="Collections"
      image="https://i.troplo.com/i/bbfccfe95019.png"
    >
      Collections are the way to organize and share your uploads, with advanced
      permissions, you can collaborate with others on your collections, and even
      create a public link that can be accessed by anyone without a TPU account.
    </PromoCard>
    <PromoCard title="Insights" image="https://i.troplo.com/i/1985c7cf1197.png">
      Insights allow you to view detailed statistics about your upload habits,
      such as when you upload.
    </PromoCard>
    <PromoCard
      title="AutoCollects"
      image="https://i.troplo.com/i/5d421e0914e0.png"
    >
      AutoCollect allows you to programmatically add files you upload to
      collections based on rules you set.
      <br />
      For example, you may set a rule that adds your upload to a "Games"
      collection if the filename contains "Skyrim"
    </PromoCard>
    <PromoCard
      title="Workspaces"
      image="https://i.troplo.com/i/8091e9037466.png"
    >
      Create documents and collaborate with others on them in real time using
      TPU Workspaces.
    </PromoCard>
  </v-col>
  <v-col class="text-center justify-center">
    <p class="text-h4 text-gradient mb-3">Statistics</p>
    <StatsWidget></StatsWidget>
  </v-col>
</template>

<script lang="ts">
import StatsWidget from "@/components/Dashboard/StatsWidget.vue";
import PromoCard from "@/components/Home/PromoCard.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UnauthHome",
  components: { PromoCard, StatsWidget },
  mounted() {
    this.$app.title = "Welcome";
  }
});
</script>

<style scoped></style>
