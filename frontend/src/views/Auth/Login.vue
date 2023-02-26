<template>
  <v-container fluid class="center-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="7" xl="5">
        <v-card
          :flat="$vuetify.display.mobile"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
        >
          <p class="text-center text-gradient mb-n5" style="font-size: 64px">
            TPU
          </p>
          <v-container>
            <v-form>
              <v-text-field
                label="Username or Email"
                v-model="username"
                autofocus
                @keydown.enter="login"
              />
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                @keydown.enter="login"
              />
              <v-text-field
                label="2FA Code (if enabled)"
                v-model="totp"
                type="number"
                @keydown.enter="login"
              />
            </v-form>
          </v-container>
          <v-card-actions class="mt-n9 mr-2">
            <v-spacer></v-spacer>
            <a @click="forgotPassword" class="pointer">I forgot my password</a>
          </v-card-actions>
          <v-card-actions>
            <v-btn to="/register">Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :loading="loading">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      totp: "",
      loading: false
    };
  },
  methods: {
    async forgotPassword() {
      this.loading = true;
      try {
        await this.axios.post("/auth/recover", {
          email: this.username
        });
        this.$toast.success(
          "Password reset email sent successfully, check your emails!"
        );
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async login() {
      this.loading = true;
      try {
        const { data } = await this.axios.post("/auth/login", {
          email: this.username,
          password: this.password,
          code: this.totp
        });
        localStorage.setItem("token", data.token);
        this.axios.defaults.headers.common["Authorization"] = data.token;
        await this.$user.init();
        this.$socket.auth = { token: data.token };
        this.$socket.disconnect();
        this.$socket.connect();
        this.$router.push("/");
      } catch {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.$app.title = "Login";
  }
});
</script>

<style scoped>
.center-container {
  height: calc(100vh - 64px);
  display: flex;
  align-items: center;
}
</style>
