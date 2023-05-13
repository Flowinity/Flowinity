<template>
  <v-alert type="success" v-if="$user.user?.totpEnable" variant="tonal">
    {{ $t("settings.home.totp.enabled") }}
  </v-alert>
  <v-alert type="info" v-else variant="tonal">
    {{ $t("settings.home.totp.disabled") }}
  </v-alert>
  <template v-if="$user.user?.totpEnable">
    <v-card-title>{{ $t("settings.home.totp.disable") }}</v-card-title>
    <v-card-text>
      {{ $t("settings.home.totp.disableText") }}
    </v-card-text>
    <v-card-text class="my-n4">
      <v-form v-model="valid" @submit.prevent="disable">
        <v-text-field
          type="password"
          v-model="password"
          :label="$t('settings.home.myAccount.password')"
          :rules="$validation.user.password"
        />
        <v-text-field
          type="number"
          v-model="code"
          :label="$t('settings.home.totp.code')"
          :rules="$validation.user.totp"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!valid" color="red" @click="disable" :loading="loading">
        {{ $t("generic.disable") }}
      </v-btn>
    </v-card-actions>
  </template>
  <template v-else-if="stage === 0">
    <v-card-title>
      {{ $t("settings.home.totp.enable") }}
    </v-card-title>
    <v-card-text v-html="$t('settings.home.totp.enableText')"></v-card-text>
    <v-card-text class="my-n4">
      <v-form v-model="valid" @submit.prevent="enable">
        <v-text-field
          type="password"
          v-model="password"
          :label="$t('settings.home.myAccount.password')"
          :rules="$validation.user.passwordSettings"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid"
        color="green"
        @click="enable"
        :loading="loading"
      >
        {{ $t("generic.enable") }}
      </v-btn>
    </v-card-actions>
  </template>
  <template v-else-if="stage === 1">
    <v-card-title>
      {{ $t("settings.home.totp.enable") }}
    </v-card-title>
    <v-card-text>
      {{ $t("settings.home.totp.scan") }}
    </v-card-text>
    <QrcodeVue :value="url" :size="250" class="ml-4" />
    <v-card-text>
      {{ $t("settings.home.totp.cantScan") }}
      <code>
        {{ secret }}
      </code>
    </v-card-text>

    <v-card-text class="my-n4">
      <v-form v-model="valid" @submit.prevent="validate">
        <v-text-field
          type="number"
          v-model="code"
          :label="$t('settings.home.totp.code')"
          :rules="$validation.user.totp"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid"
        color="green"
        @click="validate"
        :loading="loading"
      >
        {{ $t("settings.home.totp.confirm") }}
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <v-img :src="url" />
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="secret"
        :label="$t('settings.home.totp.secret')"
        outlined
        readonly
        :rules="$validation.user.totp"
      />
    </v-card-text>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  name: "TwoFactor",
  components: {
    QrcodeVue
  },
  data() {
    return {
      loading: false,
      stage: 0,
      secret: "",
      code: "",
      password: "",
      valid: false,
      url: ""
    };
  },
  methods: {
    async disable() {
      try {
        this.loading = true;
        await this.axios.patch("/user/totp", {
          code: this.code,
          password: this.password,
          action: "disable"
        });
        this.$toast.success("2FA has been disabled.");
        if (this.$user.user) this.$user.user.totpEnable = false;
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async enable() {
      try {
        this.loading = true;
        const { data } = await this.axios.patch("/user/totp", {
          password: this.password,
          action: "enable"
        });
        this.secret = data.secret;
        this.url = data.url;
        this.stage = 1;
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async validate() {
      try {
        this.loading = true;
        await this.axios.patch("/user/totp", {
          code: this.code,
          action: "validate"
        });
        this.$toast.success("2FA has been enabled.");
        if (this.$user.user) this.$user.user.totpEnable = true;
        this.loading = false;
        this.stage = 0;
        this.code = "";
        this.password = "";
      } catch {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped></style>
