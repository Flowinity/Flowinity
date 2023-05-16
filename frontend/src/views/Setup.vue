<template>
  <v-container class="center-container">
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="12" xl="5">
        <transition-group name="slide-fade">
          <template v-if="step === 0">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <div>
                <p
                  class="text-center text-gradient mb-n5"
                  style="font-size: 64px"
                >
                  TPU
                </p>
                <v-container>
                  <v-card-text>
                    {{ $t("setup.step0.description") }}
                  </v-card-text>
                  <v-card-text class="text-grey">
                    {{ $t("setup.step0.subtitle") }}
                  </v-card-text>
                </v-container>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 1">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step1.title") }}
              </v-card-title>
              <v-card-text class="text-grey">
                {{ $t("setup.step1.subtitle") }}
              </v-card-text>
              <v-form @submit="testMariaDBConnection">
                <v-card-text>
                  <v-text-field
                    v-model="database.host"
                    :label="$t('setup.step1.host')"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.port"
                    :label="$t('setup.step1.port')"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.database"
                    :label="$t('setup.step1.database')"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.username"
                    :label="$t('setup.step1.username')"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.password"
                    :label="$t('setup.step1.password')"
                    type="password"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="testMariaDBConnection"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 2">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step5.title") }}
              </v-card-title>
              <v-card-text class="text-grey">
                {{ $t("setup.step5.subtitle") }}
              </v-card-text>
              <v-form @submit="createDefaultPlan">
                <v-card-text>
                  <v-text-field
                    v-model="plan.quotaMax"
                    :label="$t('setup.step5.storage')"
                    type="number"
                  ></v-text-field>
                  <v-text-field
                    v-model="plan.maxFileSize"
                    :label="$t('setup.step5.maxUploadSize')"
                    type="number"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="createDefaultPlan"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 3">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step2.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step2.subtitle") }}
              </v-card-subtitle>
              <v-form @submit="createAdminAccount">
                <v-card-text>
                  <v-text-field
                    v-model="admin.username"
                    :label="$t('setup.step2.username')"
                    :rules="$validation.user.username"
                  ></v-text-field>
                  <v-text-field
                    v-model="admin.email"
                    :label="$t('setup.step2.email')"
                    :rules="$validation.user.email"
                  ></v-text-field>
                  <v-text-field
                    v-model="admin.password"
                    :label="$t('setup.step2.password')"
                    :rules="$validation.user.password"
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="admin.passwordConfirm"
                    :label="$t('setup.step2.passwordConfirm')"
                    :rules="$validation.user.password"
                    type="password"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="createAdminAccount"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 4">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step3.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step3.subtitle") }}
              </v-card-subtitle>
              <v-form @submit="step++">
                <v-card-text>
                  <v-text-field
                    v-model="instance.name"
                    :label="$t('setup.step3.name')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.hostname"
                    :label="$t('setup.step3.hostname')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.hostnameWithProtocol"
                    :label="$t('setup.step3.hostnameWithProtocol')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.port"
                    :label="$t('setup.step3.port')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.multiThreaded"
                    :label="$t('setup.step3.multiThreaded')"
                  ></v-text-field>
                  <v-switch
                    v-model="instance.allowRegistrations"
                    :label="$t('setup.step3.allowRegistration')"
                  ></v-switch>
                  <v-text-field
                    v-model="instance.redisHostname"
                    :label="$t('setup.step3.redisHostname')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.redisDatabase"
                    :label="$t('setup.step3.redisDatabase')"
                  ></v-text-field>
                  <v-text-field
                    v-model="instance.redisPort"
                    :label="$t('setup.step3.redisPort')"
                  ></v-text-field>
                  <small>
                    {{ $t("setup.step3.redisHint") }}
                  </small>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 5">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step4.title") }}
              </v-card-title>
              <v-card-text class="text-grey overflow">
                {{ $t("setup.step4.subtitle") }}
              </v-card-text>
              <PromoCard
                :title="$t('setup.step4.collections.title')"
                class="my-3"
                image="https://i.troplo.com/i/3276e55f5ce4.png"
              >
                {{ $t("setup.step4.collections.description") }}
                <v-switch
                  v-model="features.collections"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <PromoCard
                :title="$t('setup.step4.autoCollects.title')"
                class="my-3"
                image="https://i.troplo.com/i/f8e3d77d3128.png"
              >
                {{ $t("setup.step4.autoCollects.description") }}
                <v-switch
                  v-model="features.autoCollects"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <PromoCard
                :title="$t('setup.step4.communications.title')"
                class="my-3"
                image="https://i.troplo.com/i/356a95ba22ff.png"
              >
                {{ $t("setup.step4.communications.description") }}
                <v-switch
                  v-model="features.communications"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <PromoCard
                :title="$t('setup.step4.insights.title')"
                class="my-3"
                image="https://i.troplo.com/i/ff3eda567a8e.png"
              >
                {{ $t("setup.step4.insights.description") }}
                <v-switch
                  v-model="features.insights"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <PromoCard
                :title="$t('setup.step4.workspaces.title')"
                class="my-3"
                image="https://i.troplo.com/i/d251cd7d08af.png"
              >
                {{ $t("setup.step4.workspaces.description") }}
                <v-switch
                  v-model="features.workspaces"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="configureInstance"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 6">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step6.title") }}
              </v-card-title>
              <v-card-text class="text-grey overflow">
                {{ $t("setup.step6.subtitle") }}
              </v-card-text>

              <v-form>
                <v-card-text>
                  <v-text-field
                    v-model="mail.host"
                    :label="$t('setup.step6.host')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="mail.port"
                    :label="$t('setup.step6.port')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="mail.username"
                    :label="$t('setup.step6.username')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="mail.password"
                    :label="$t('setup.step6.password')"
                    required
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="mail.from"
                    :label="$t('setup.step6.from')"
                    required
                  ></v-text-field>
                  <v-switch
                    v-model="mail.secure"
                    :label="$t('setup.step6.secure')"
                  ></v-switch>
                  <v-text-field
                    v-model="mail.testEmail"
                    :label="$t('setup.step6.testEmail')"
                  ></v-text-field>
                </v-card-text>
              </v-form>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" @click="testMail">
                  {{ $t("setup.step6.test") }}
                </v-btn>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="configureMail"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 7">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <p
                class="text-center text-gradient mb-n5"
                style="font-size: 64px"
              >
                TPU
              </p>
              <v-card-title>
                {{ $t("setup.step7.title") }}
              </v-card-title>
              <v-card-text class="text-grey overflow">
                {{ $t("setup.step7.subtitle") }}
              </v-card-text>
              <v-btn
                :loading="loading"
                class="mb-4"
                color="primary"
                @click="restartTPU"
              >
                {{ $t("setup.step7.restart") }}
              </v-btn>
            </v-card>
          </template>
          <template v-if="step === 8">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
              class="text-center"
              max-width="90vw"
              variant="outlined"
            >
              <p
                class="text-center text-gradient mb-n5"
                style="font-size: 64px"
              >
                TPU
              </p>
              <v-card-text>
                {{ $t("setup.step8.title") }}
              </v-card-text>
            </v-card>
          </template>
        </transition-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoCard from "@/components/Home/PromoCard.vue";

enum Step {
  Welcome = 0,
  DatabaseConfig,
  Plan,
  AdminUser,
  InstanceSetup,
  Features,
  Mail,
  Finish,
  Restarting
}

export default defineComponent({
  name: "InstanceSetupWizard",
  components: { PromoCard },
  data() {
    return {
      step: (this.$app.site?.step as Step) || (0 as Step),
      loading: false,
      database: {
        host: "localhost",
        port: 3306,
        database: "",
        username: "",
        password: ""
      },
      admin: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: ""
      },
      instance: {
        name: "TPU",
        hostname: "",
        hostnameWithProtocol: "",
        port: 34582,
        allowRegistrations: true,
        multiThreaded: 0,
        redisHostname: "localhost",
        redisPort: "6379",
        redisDatabase: "0"
      },
      features: {
        autoCollects: true,
        collections: true,
        workspaces: true,
        insights: true,
        communications: true
      },
      plan: {
        quotaMax: "75866302316544",
        maxFileSize: "9223372036854775805"
      },
      mail: {
        host: "",
        port: "465",
        username: "",
        password: "",
        from: '"TroploPrivateUploader" <noreply@privateuploader.com>',
        secure: true,
        testEmail: ""
      }
    };
  },
  methods: {
    async pollTPU() {
      try {
        const { data } = (await this.axios.get("/core")) as {
          data: {
            finishedSetup: boolean;
          };
        };
        if (data.finishedSetup) {
          await this.$app.init();
          this.$router.push("/");
        } else {
          setTimeout(this.pollTPU, 1000);
        }
      } catch {
        setTimeout(this.pollTPU, 1000);
      }
    },
    async restartTPU() {
      this.loading = true;
      try {
        await this.axios.post("/setup/restart");
        this.step++;
        this.pollTPU();
      } catch {
        this.loading = false;
      }
    },
    async testMail() {
      this.loading = true;
      try {
        await this.axios.post("/setup/mail/test", {
          host: this.mail.host,
          port: parseInt(this.mail.port),
          username: this.mail.username,
          password: this.mail.password,
          from: this.mail.from,
          secure: this.mail.secure,
          testEmail: this.mail.testEmail
        });
        this.$toast("Test email sent successfully.");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async configureMail() {
      this.loading = true;
      await this.axios.post("/setup/mail", {
        host: this.mail.host,
        port: parseInt(this.mail.port),
        username: this.mail.username,
        password: this.mail.password,
        from: this.mail.from,
        secure: this.mail.secure
      });
      this.step++;
      this.$toast("Successfully configured mail");
      this.loading = false;
    },
    async configureInstance() {
      this.loading = true;
      await this.axios.post("/setup/instance", {
        siteName: this.instance.name,
        hostname: this.instance.hostname,
        hostnameWithProtocol: this.instance.hostnameWithProtocol,
        port: this.instance.port,
        registrations: this.instance.allowRegistrations,
        threads: this.instance.multiThreaded,
        features: this.features,
        redis: {
          db: parseInt(this.instance.redisDatabase),
          host: this.instance.redisHostname,
          port: parseInt(this.instance.redisPort)
        }
      });
      this.step++;
      this.$toast("Successfully configured instance");
      this.loading = false;
    },
    async testMariaDBConnection() {
      this.loading = true;
      await this.axios.post("/setup/database", {
        host: this.database.host,
        port: this.database.port,
        database: this.database.database,
        username: this.database.username,
        password: this.database.password
      });
      this.step++;
      this.$toast("Successfully connected to MariaDB server");
      this.loading = false;
    },
    async createAdminAccount() {
      this.loading = true;
      await this.axios.post("/setup/admin", {
        username: this.admin.username,
        password: this.admin.password,
        email: this.admin.email
      });
      this.step++;
      this.$toast("Successfully created admin account");
      this.loading = false;
    },
    async createDefaultPlan() {
      this.loading = true;
      await this.axios.post("/setup/plan", {
        name: "Free",
        quotaMax: parseInt(this.plan.quotaMax),
        maxFileSize: parseInt(this.plan.maxFileSize)
      });
      this.step++;
      this.$toast("Successfully created default plan");
      this.loading = false;
    }
  },
  mounted() {
    this.$app.title = "Setup Wizard";
  },
  watch: {
    "$app.site.step": {
      immediate: true,
      handler(step: Step) {
        this.step = step;
      }
    }
  }
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  display: none;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

:deep(.promo-card) {
  border-radius: 0 !important;
}
</style>
