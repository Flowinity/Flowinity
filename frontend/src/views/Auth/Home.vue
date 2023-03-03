<template>
  <ColubrinaTPU v-model="$app.dialogs.colubrina"></ColubrinaTPU>
  <div class="hero">
    <div class="hero-body" :class="{'mx-5 mobile': $vuetify.display.mobile}">
      <div class="title">
        Welcome to
        <span class="text-gradient">TPU</span>.
      </div>
      <div class="subtitle">
        The
        <span class="text-gradient">versatile</span> image hosting service, now for <span class="text-gradient">everyone</span>.
      </div>
      <div class="mt-4">
        <v-text-field
          variant="filled"
          v-model="email"
          label="Email"
          outlined
          type="email"
          color="white"
          class="sign-up-button"
          @keydown.enter="getStarted"
          placeholder="troplo@troplo.com"
        >
          <template v-slot:append>
            <v-btn
              style="background-color: #121212; letter-spacing: 0.045em;"
              color="white"
              variant="outlined"
              block
              height="100%"
              @click="getStarted"
            >
              <template v-if="!$vuetify.display.mobile">
                Get Started...
              </template>
              <template v-else>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-btn>
          </template>
        </v-text-field>
      </div>
      <!-- learn more down arrow positioned at the bottom of the hero -->
      <div class="learn-more">
        <HoverChip
          @click="scrollDown()"
          class="learn-more-button"
          color="white"
          icon="mdi-chevron-down"
          text="Learn More"
        >
        </HoverChip>
      </div>
    </div>
  </div>
  <v-container id="content">
    <PromoCard title="Feature Update: TPU v2.1" image="https://i.troplo.com/i/aae2fb2c0cf8.png" :height="260" :hover="true" class="mb-6">
      <p>
        TPU 2.1 adds Workspaces, a new way to create documents and quick notes.
      </p>
    </PromoCard>
    <v-row>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Scoped API Keys" icon="mdi-lock" :height="260" :hover="true">
          <p>
            TPU's API is designed to be simple, yet customizable, you can create
            a different API key for each integration, each with their own sets
            of rules on what they can access.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Collections" icon="mdi-folder-multiple-image" :height="260" :hover="true">
          <p>
            Want to organize your screenshots or files? Collections are the way
            to do so, add items to one or many collections of your choosing to
            greater organize your files.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="AutoCollects" icon="mdi-image-auto-adjust" :height="260" :hover="true">
          <p>
            AutoCollects allow you to create rules that automatically add files
            to a collection, for example, you can have a rule that triggers when
            the scanned text of the image contains "Skyrim" and add it to a
            "Games" collection.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Insights" icon="mdi-chart-timeline-variant-shimmer" :height="260" :hover="true">
          <p>
            Insights allow you to see highly detailed statistics on how you use
            TPU. Such as when you upload files, how many you've uploaded, how
            much you use TPU, and more.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Workspaces" icon="mdi-folder-account" :height="260" :hover="true">
          <p>
            TPU Workspaces allow you to create documents right inside of your
            TPU account. You can create documents, edit them, and share them
            with others.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Communications" icon="mdi-message-processing" :height="260" :hover="true">
          <p>
            TPU Communications allow you to create direct messages, and groups
            with other TPU members in a fully featured messaging system.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="ShareX Compatible" icon="mdi-upload" :height="260" :hover="true">
          <p>
            TPU is fully compatible with ShareX and Sharenix, you can additionally use TPU's API to create custom
            integrations.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Scoped Passwords" icon="mdi-form-textbox-password" :height="260" :hover="true">
          <p>
            Scoped Passwords allow you to create a different password with different API access permissions, if you need a way to access a part of your TPU without risking the rest of your account, Scoped Passwords are an option.
          </p>
        </PromoCard>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <PromoCard title="Sharing & Collaboration" icon="mdi-share" :height="260" :hover="true">
          <p>
            TPU is built from the ground up to allow for collaboration and sharing, share collections, slideshows, workspace documents and more with other TPU users and non-TPU users via a unique share link.
          </p>
        </PromoCard>
      </v-col>
    </v-row>
    <PromoCard title="Report an Upload" :height="300" :hover="true" class="mb-6" :left="true">
      <p>
        Is there a file hosted on TPU that you believe violates our <router-link to="/policies/content">Content Policy</router-link>? Please report it here.
      </p>
      <template v-slot:left>
        <div class="mr-3">
          <v-text-field @keyup.enter="reportUpload" v-model="report.tpuLink" label="URL to Report" placeholder="https://i.troplo.com/i/aae2fb2c0cf8.png" outlined variant="filled" color="white"></v-text-field>
          <v-text-field @keyup.enter="reportUpload" auto-grow v-model="report.content" label="Reporting reason" placeholder="This upload violates the Content Policy because..." variant="filled" color="white"></v-text-field>
          <v-text-field @keyup.enter="reportUpload" v-model="report.email" label="Email to get back to you (optional)" placeholder="troplo@troplo.com" outlined variant="filled" color="white"></v-text-field>
          <v-btn color="primary" @click="reportUpload" :loading="report.loading">Report</v-btn>
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
import HoverChip from "@/components/Core/HoverChip.vue"

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
        this.$toast.success("Upload reported successfully! We will review it as soon as possible.")
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
    this.$app.title = "Welcome";
    if (this.$route.query.ref === "colubrina") {
      this.$app.dialogs.colubrina = true;
    }
  }
});
</script>

<style scoped lang="scss">
$bg-color: #101010;
$dot-color: rgba(255, 255, 255, 0.3);
$dot-size: 1px;
$dot-space: 22px;
.hero {
  height: calc(100vh - 56px);
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}
.hero-body {
  text-align: center;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-image: radial-gradient(#dcd6d6 1px, transparent 0);
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
