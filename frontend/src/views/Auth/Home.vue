<template>
  <ColubrinaTPU v-model="$app.dialogs.colubrina"></ColubrinaTPU>
  <div class="hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        Welcome to the
        <strong>new</strong>
        social platform.
      </div>
      <div class="subtitle">
        The
        <strong>versatile</strong>
        all-in-one online platform, now for
        <strong>everyone.</strong>
      </div>
      <div class="mt-4">
        <v-btn variant="outlined">
          Register now
        </v-btn>
        <p class="mb-n2" v-if="!$app.site.officialInstance">
          This is a
          <a
            rel="noopener"
            class="text-gradient"
            target="_blank"
            href="https://github.com/Troplo/PrivateUploader"
          >
            TPU
          </a>
          instance.
        </p>
      </div>
      <!-- learn more down arrow positioned at the bottom of the hero -->
      <div class="learn-more">
        <HoverChip
          class="learn-more-button"
          color="white"
          icon="mdi-chevron-down"
          text="Learn More"
          @click="scrollDown()"
        ></HoverChip>
      </div>
    </div>
  </div>
  <v-container id="content">
    <v-card-title class="text-center mb-3" style="font-size: 30px">Why <span class="text-gradient">PrivateUploader</span>?</v-card-title>
    <div class="d-flex flex-column" style="gap: 10px;">
      <PromoCard width="100%" title="Chat with friends in an instant!" image="https://i.troplo.com/i/6bc5f9f7f4d3.png">
        As a fully-fledged chatting application, you can instantly contact your friends with direct messages and in groups.
      </PromoCard>
      <PromoCard width="100%" title="Have Full Control" image="https://i.troplo.com/i/8ec635313416.png" :right="true">
        With PrivateUploader Communications you can now create "Ranks" which can be assigned to individual users with a vast number of different permissions to choose from.<br><v-chip class="mt-1" variant="outlined">New in version 4</v-chip>
      </PromoCard>
      <PromoCard width="100%" title="Safely Store Your Files" image="https://i.troplo.com/i/815f20a6f39e.png">
        With the Gallery, you can securely store files such as screenshots, images, videos, and other files.<br><br>PrivateUploader also integrates with ShareX, and has APIs to create various other integrations.
      </PromoCard>
      <PromoCard width="100%" title="Organization Made Easy" image="https://i.troplo.com/i/8e62bab88002.png" :right="true">
        You can add as many files as you please into Collections, which can be shared publicly, or to other PrivateUploader users with different permissions.
      </PromoCard>
      <PromoCard width="100%" title="Security First" image="https://i.troplo.com/i/34f6a6a57bc9.png">
        With PrivateUploader, you can easily create as many API keys as you want, all with different account access permissions.<br><br>You can even create Alternate Passwords which have different account permissions when used.
      </PromoCard>
      <PromoCard width="100%" title="100% Open Source" image="https://i.troplo.com/i/1ff020441915.png" :right="true">
        PrivateUploader is completely open source on GitHub, and can also be easily self-hosted bare-metal or under Docker (Only Linux supported).<br><br>
        <v-btn variant="outlined" href="https://github.com/PrivateUploader/PrivateUploader"><v-icon class="mr-2">mdi-star</v-icon>Star on GitHub</v-btn>
      </PromoCard>
    </div>
    <PromoCard
      :left="true"
      class="mb-6 mt-4"
      title="Report an Upload"
    >
      <p>
        Is there a file hosted on {{ $app.site.name }} that you believe violates
        our
        <router-link to="/policies/content">Content Policy?</router-link>
        Please report it here.
      </p>
      <template v-slot:left>
        <div class="mr-3">
          <v-text-field
            v-model="report.tpuLink"
            color="white"
            label="URL to Report"
            outlined
            placeholder="https://i.troplo.com/i/aae2fb2c0cf8.png"
            variant="filled"
            @keyup.enter="reportUpload"
          ></v-text-field>
          <v-text-field
            v-model="report.content"
            auto-grow
            color="white"
            label="Reporting reason"
            placeholder="This upload violates the Content Policy because..."
            variant="filled"
            @keyup.enter="reportUpload"
          ></v-text-field>
          <v-text-field
            v-model="report.email"
            color="white"
            label="Email to get back to you (optional)"
            outlined
            placeholder="troplo@troplo.com"
            variant="filled"
            @keyup.enter="reportUpload"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="report.loading"
              color="primary"
              @click="reportUpload"
            >
             Report
           </v-btn>
          </v-card-actions>
        </div>
      </template>
    </PromoCard>
  </v-container>
</template>

<script lang="ts">
import StatsWidget from "@/components/Dashboard/StatsWidget.vue";
import PromoCard from "@/components/Home/PromoCard.vue";
import { defineComponent } from "vue";
import ColubrinaTPU from "@/components/Home/Dialogs/ColubrinaTPU.vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "UnauthHome",
  components: { HoverChip, ColubrinaTPU, PromoCard, StatsWidget },
  data() {
    return {
      email: "",
      report: {
        tpuLink: "",
        content: "",
        email: "",
        loading: false
      }
    };
  },
  methods: {
    async reportUpload() {
      this.report.loading = true;
      try {
        await this.axios.post("/core/report", this.report);
        this.report.loading = false;
        this.$toast.success(
          "Upload reported successfully! We will review it as soon as possible."
        );
        this.report.tpuLink = "";
        this.report.content = "";
        this.report.email = "";
      } catch {
        this.report.loading = false;
      }
    },
    getStarted() {
      this.$router.push({
        name: "Register",
        query: {
          email: this.email
        }
      });
    },
    scrollDown() {
      const content = document.getElementById("content");
      if (content) {
        content.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    }
  },
  mounted() {
    // Check $app.site.hostnames and window.location.hostname to see if we should redirect
    if (this.$app.site.release !== "dev") {
      if (
        this.$app.site.hostnames &&
        !this.$app.site.hostnames.includes(window.location.hostname)
      ) {
        window.location.href =
          (this.$app.site.hostnameWithProtocol ??
            "https://images.flowinity.com") + "/home?redirected=true";
      }
    }
    this.$app.title = "Welcome";
    if (this.$route.query.ref === "colubrina") {
      this.$app.dialogs.colubrina = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.hero {
  height: 400px;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: rgba(0, 67, 143, 0.8)
}

.hero-body {
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.hero-body .title {
  font-size: 4rem;
  font-weight: 700;
}

.mobile .title {
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
}

.mobile .subtitle {
  font-size: 1.25rem;
}

.learn-more {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  margin-bottom: 1rem;
}
</style>

<style>
.sign-up-button,
.v-input__prepend,
.v-input__append {
  padding-top: 0 !important;
}
</style>
