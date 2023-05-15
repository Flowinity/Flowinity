<template>
  <v-container class="center-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <transition-group name="slide-fade">
          <template v-if="step === 0">
            <v-card
              :color="$vuetify.display.mobile ? 'transparent' : 'card'"
              :elevation="$vuetify.display.mobile ? 0 : 8"
              :flat="$vuetify.display.mobile"
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
                <v-btn class="pulse-button" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
                    v-model="database.host"
                    :label="$t('setup.step1.host')"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.port"
                    :label="$t('setup.step1.port')"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.database"
                    :label="$t('setup.step1.database')"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.username"
                    :label="$t('setup.step1.username')"
                  ></v-text-field>
                  <v-text-field
                    v-model="database.password"
                    :label="$t('setup.step1.password')"
                    type="password"
                  ></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="pulse-button" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
                <v-btn class="pulse-button" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="pulse-button" color="primary" @click="step++">
                  {{ $t("generic.next") }}
                  <v-icon>mdi-arrow-right</v-icon>
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
              variant="outlined"
            >
              <v-card-title>
                {{ $t("setup.step4.title") }}
              </v-card-title>
              <v-card-subtitle>
                {{ $t("setup.step4.subtitle") }}
              </v-card-subtitle>
              <PromoCard
                :title="$t('setup.step4.autoCollects.title')"
                image="https://i.troplo.com/i/f8e3d77d3128.png"
              >
                {{ $t("setup.step4.autoCollects.description") }}
                <v-switch
                  v-model="features.autoCollects"
                  hide-details
                  style="display: flex; justify-content: center"
                ></v-switch>
              </PromoCard>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="pulse-button" color="primary" @click="step++">
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
import {defineComponent} from "vue"
import PromoCard from "@/components/Home/PromoCard.vue"

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
  components: {PromoCard},
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
    }
  },
  methods: {
    configureInstance() {
      console.log("configure")
    },
    testMariaDBConnection() {
      console.log("test")
    },
    createAdminAccount() {
      console.log("create")
    }
  }
})
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
