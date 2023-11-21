<template>
  <ColubrinaTPU v-model="$app.dialogs.colubrina" />
  <div class="hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        Welcome to
        <span class="text-gradient">{{ $app.site.name || "TPU" }}.</span>
      </div>
      <div class="subtitle">
        The
        <span class="text-gradient">versatile</span>
        image hosting service, now for
        <span class="text-gradient">everyone.</span>
      </div>
      <div class="mt-4">
        <v-text-field
          v-model="email"
          class="sign-up-button"
          color="white"
          label="Email"
          outlined
          placeholder="troplo@troplo.com"
          type="email"
          variant="filled"
          @keydown.enter="getStarted"
        >
          <template v-slot:append>
            <v-btn
              block
              color="white"
              height="100%"
              style="background-color: #121212; letter-spacing: 0.045em"
              title="Get Started"
              variant="outlined"
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
        />
      </div>
    </div>
  </div>
  <v-container id="content">
    <PromoCard
      :height="260"
      :hover="true"
      class="mb-6"
      image="https://i.troplo.com/i/aae2fb2c0cf8.png"
      title="Feature Update: TPU v2.1"
    >
      <p>
        TPU 2.1 adds Workspaces, a new way to create documents and quick notes.
      </p>
    </PromoCard>
    <v-row>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-lock"
          title="Scoped API Keys"
        >
          <p>
            TPU's API is designed to be simple, yet customizable, you can create
            a different API key for each integration, each with their own sets
            of rules on what they can access.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-folder-multiple-image"
          title="Collections"
        >
          <p>
            Want to organize your screenshots or files? Collections are the way
            to do so, add items to one or many collections of your choosing to
            greater organize your files.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-image-auto-adjust"
          title="AutoCollects"
        >
          <p>
            AutoCollects allow you to create rules that automatically add files
            to a collection, for example, you can have a rule that triggers when
            the scanned text of the image contains "Skyrim" and add it to a
            "Games" collection.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-chart-timeline-variant-shimmer"
          title="Insights"
        >
          <p>
            Insights allow you to see highly detailed statistics on how you use
            TPU. Such as when you upload files, how many you've uploaded, how
            much you use TPU, and more.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-folder-account"
          title="Workspaces"
        >
          <p>
            TPU Workspaces allow you to create documents right inside of your
            TPU account. You can create documents, edit them, and share them
            with others.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-message-processing"
          title="Communications"
        >
          <p>
            TPU Communications allow you to create direct messages, and groups
            with other TPU members in a fully featured messaging system.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-upload"
          title="ShareX Compatible"
        >
          <p>
            TPU is fully compatible with ShareX and Sharenix, you can
            additionally use TPU's API to create custom integrations.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-form-textbox-password"
          title="Scoped Passwords"
        >
          <p>
            Scoped Passwords allow you to create a different password with
            different API access permissions, if you need a way to access a part
            of your TPU without risking the rest of your account, Scoped
            Passwords are an option.
          </p>
        </PromoCard>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <PromoCard
          :height="260"
          :hover="true"
          icon="mdi-share"
          title="Sharing & Collaboration"
        >
          <p>
            TPU is built from the ground up to allow for collaboration and
            sharing, share collections, slideshows, workspace documents and more
            with other TPU users and non-TPU users via a unique share link.
          </p>
        </PromoCard>
      </v-col>
    </v-row>
    <PromoCard
      :height="365"
      :hover="true"
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
          />
          <v-text-field
            v-model="report.content"
            auto-grow
            color="white"
            label="Reporting reason"
            placeholder="This upload violates the Content Policy because..."
            variant="filled"
            @keyup.enter="reportUpload"
          />
          <v-text-field
            v-model="report.email"
            color="white"
            label="Email to get back to you (optional)"
            outlined
            placeholder="troplo@troplo.com"
            variant="filled"
            @keyup.enter="reportUpload"
          />
          <v-btn
            :loading="report.loading"
            color="primary"
            @click="reportUpload"
          >
            Report
          </v-btn>
        </div>
      </template>
    </PromoCard>
  </v-container>
</template>

<script lang="ts">
import PromoCard from "@/components/Home/PromoCard.vue";
import { defineComponent } from "vue";
import ColubrinaTPU from "@/components/Home/Dialogs/ColubrinaTPU.vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  name: "UnauthHome",
  components: { HoverChip, ColubrinaTPU, PromoCard },
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
$bg-color: #000000;
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
