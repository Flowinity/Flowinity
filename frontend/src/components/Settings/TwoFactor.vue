<template>
  <v-alert v-if="$user.user?.totpEnable" type="success" variant="tonal">
    {{ $t("settings.home.totp.enabled") }}
  </v-alert>
  <v-alert v-else type="info" variant="tonal">
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
          v-model="password"
          :label="$t('settings.home.myAccount.password')"
          :rules="$validation.user.password"
          type="password"
        />
        <v-text-field
          v-model="code"
          :label="$t('settings.home.totp.code')"
          :rules="$validation.user.totp"
          type="number"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!valid" :loading="loading" color="red" @click="disable">
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
          v-model="password"
          :label="$t('settings.home.myAccount.password')"
          :rules="$validation.user.passwordSettings"
          type="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid"
        :loading="loading"
        color="green"
        @click="enable"
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
    <QrcodeVue :size="250" :value="url" class="ml-4" />
    <v-card-text>
      {{ $t("settings.home.totp.cantScan") }}
      <code>
        {{ secret }}
      </code>
    </v-card-text>

    <v-card-text class="my-n4">
      <v-form v-model="valid" @submit.prevent="validate">
        <v-text-field
          v-model="code"
          :label="$t('settings.home.totp.code')"
          :rules="$validation.user.totp"
          type="number"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid"
        :loading="loading"
        color="green"
        @click="validate"
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
        :rules="$validation.user.totp"
        outlined
        readonly
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
