<template>
  <v-container fluid class="center-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="7" xl="5">
        <transition-group name="slide-fade">
          <template v-if="step === 0">
            <v-card
              :flat="$vuetify.display.mobile"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              class="text-center"
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
                  <v-card-subtitle>
                    {{ $t("setup.step0.subtitle") }}
                  </v-card-subtitle>
                </v-container>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="step++" class="pulse-button">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
            >
              <v-card-title>
                {{ $t("setup.step1.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step1.subtitle") }}
              </v-card-subtitle>
              <v-form @submit="testMariaDBConnection">
                <v-card-text>
                  <v-text-field
                    :label="$t('setup.step1.host')"
                    v-model="database.host"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.port')"
                    v-model="database.port"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.database')"
                    v-model="database.database"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.username')"
                    v-model="database.username"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('setup.step1.password')"
                    v-model="database.password"
                    type="password"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="step++" class="pulse-button">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
                <v-btn color="primary" @click="step++" class="pulse-button">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
            >
              <v-card-title>
                {{ $t("setup.step3.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step3.subtitle") }}
              </v-card-subtitle>
              <v-form @submit="configureInstance">
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
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="step++" class="pulse-button">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
            >
              <v-card-title>
                {{ $t("setup.step4.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step4.subtitle") }}
              </v-card-subtitle>
              <PromoCard
                image="https://i.troplo.com/i/f8e3d77d3128.png"
                :title="$t('setup.step4.collections.title')"
              >
                {{ $t("setup.step4.collections.description") }}
                <v-switch v-model="features.autoCollects"></v-switch>
              </PromoCard>
              <PromoCard
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="step++" class="pulse-button">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
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
  AdminUser,
  Features,
  Mail,
  Finish
}
export default defineComponent({
  name: "InstanceSetupWizard",
  components: { PromoCard },
  data() {
    return {
      step: 0 as Step,
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
        multiThreaded: 0
      },
      features: {
        autoCollects: true
      }
    };
  },
  methods: {
    configureInstance() {
      console.log("configure");
    },
    testMariaDBConnection() {
      console.log("test");
    },
    createAdminAccount() {
      console.log("create");
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
</style>
