<template>
  <v-container class="center-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="7" xl="5">
        <transition-group name="slide-fade">
          <template v-if="step === 0">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                <v-btn color="primary" @click="step++" :loading="loading">
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 1">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                    :label="$t('setup.step1.host')"
                    v-model="database.host"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.port')"
                    v-model="database.port"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.database')"
                    v-model="database.database"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.username')"
                    v-model="database.username"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.password')"
                    v-model="database.password"
                    type="password"
                    @keyup.enter="testMariaDBConnection"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="testMariaDBConnection"
                  :loading="loading"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 2">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                    :label="$t('setup.step5.storage')"
                    v-model="plan.quotaMax"
                    type="number"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step5.maxUploadSize')"
                    v-model="plan.maxFileSize"
                    type="number"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="createDefaultPlan"
                  :loading="loading"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 3">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                    :label="$t('setup.step2.username')"
                    v-model="admin.username"
                    :rules="$validation.user.username"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step2.email')"
                    v-model="admin.email"
                    :rules="$validation.user.email"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step2.password')"
                    v-model="admin.password"
                    type="password"
                    :rules="$validation.user.password"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step2.passwordConfirm')"
                    v-model="admin.passwordConfirm"
                    type="password"
                    :rules="$validation.user.password"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="createAdminAccount"
                  :loading="loading"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 4">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                    :label="$t('setup.step3.name')"
                    v-model="instance.name"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.hostname')"
                    v-model="instance.hostname"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.hostnameWithProtocol')"
                    v-model="instance.hostnameWithProtocol"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.port')"
                    v-model="instance.port"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.multiThreaded')"
                    v-model="instance.multiThreaded"
                  ></v-text-field>
                  <v-switch
                    :label="$t('setup.step3.allowRegistration')"
                    v-model="instance.allowRegistrations"
                  ></v-switch>
                  <v-text-field
                    :label="$t('setup.step3.redisHostname')"
                    v-model="instance.redisHostname"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.redisDatabase')"
                    v-model="instance.redisDatabase"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step3.redisPort')"
                    v-model="instance.redisPort"
                  ></v-text-field>
                  <small>
                    {{ $t("setup.step3.redisHint") }}
                  </small>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="step++" :loading="loading">
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 5">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
            >
              <v-card-title>
                {{ $t("setup.step4.title") }}
              </v-card-title>
              <v-card-text class="text-grey overflow">
                {{ $t("setup.step4.subtitle") }}
              </v-card-text>
              <PromoCard
                class="my-3"
                image="https://i.troplo.com/i/3276e55f5ce4.png"
                :title="$t('setup.step4.collections.title')"
              >
                {{ $t("setup.step4.collections.description") }}
                <v-switch
                  style="display: flex; justify-content: center"
                  hide-details
                  v-model="features.collections"
                ></v-switch>
              </PromoCard>
              <PromoCard
                class="my-3"
                image="https://i.troplo.com/i/f8e3d77d3128.png"
                :title="$t('setup.step4.autoCollects.title')"
              >
                {{ $t("setup.step4.autoCollects.description") }}
                <v-switch
                  style="display: flex; justify-content: center"
                  hide-details
                  v-model="features.autoCollects"
                ></v-switch>
              </PromoCard>
              <PromoCard
                class="my-3"
                image="https://i.troplo.com/i/356a95ba22ff.png"
                :title="$t('setup.step4.communications.title')"
              >
                {{ $t("setup.step4.communications.description") }}
                <v-switch
                  style="display: flex; justify-content: center"
                  hide-details
                  v-model="features.communications"
                ></v-switch>
              </PromoCard>
              <PromoCard
                class="my-3"
                image="https://i.troplo.com/i/ff3eda567a8e.png"
                :title="$t('setup.step4.insights.title')"
              >
                {{ $t("setup.step4.insights.description") }}
                <v-switch
                  style="display: flex; justify-content: center"
                  hide-details
                  v-model="features.insights"
                ></v-switch>
              </PromoCard>
              <PromoCard
                class="my-3"
                image="https://i.troplo.com/i/d251cd7d08af.png"
                :title="$t('setup.step4.workspaces.title')"
              >
                {{ $t("setup.step4.workspaces.description") }}
                <v-switch
                  style="display: flex; justify-content: center"
                  hide-details
                  v-model="features.workspaces"
                ></v-switch>
              </PromoCard>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="configureInstance"
                  :loading="loading"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 6">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                    :label="$t('setup.step6.host')"
                    v-model="mail.host"
                    required
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step6.port')"
                    v-model="mail.port"
                    required
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step6.username')"
                    v-model="mail.username"
                    required
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step6.password')"
                    v-model="mail.password"
                    required
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step6.from')"
                    v-model="mail.from"
                    required
                  ></v-text-field>
                  <v-switch
                    :label="$t('setup.step6.secure')"
                    v-model="mail.secure"
                  ></v-switch>
                  <v-text-field
                    :label="$t('setup.step6.testEmail')"
                    v-model="mail.testEmail"
                  ></v-text-field>
                </v-card-text>
              </v-form>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="testMail" :loading="loading">
                  {{ $t("setup.step6.test") }}
                </v-btn>
                <v-btn
                  color="primary"
                  @click="configureMail"
                  :loading="loading"
                >
                  {{ $t("generic.next") }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-if="step === 7">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
                color="primary"
                @click="restartTPU"
                :loading="loading"
                class="mb-4"
              >
                {{ $t("setup.step7.restart") }}
              </v-btn>
            </v-card>
          </template>
          <template v-if="step === 8">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
              variant="outlined"
              max-width="90vw"
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
