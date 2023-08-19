<template>
  <v-container class="center-container" :fluid="true">
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
        >
          <p class="text-center text-gradient mb-n5" style="font-size: 64px">
            TPU
          </p>
          <v-container>
            <v-form>
              <v-text-field
                v-model="username"
                :autofocus="true"
                label="Username or Email"
                @keydown.enter="login"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                @keydown.enter="login"
              />
              <v-text-field
                v-model="totp"
                label="2FA Code (if enabled)"
                type="number"
                @keydown.enter="login"
              />
            </v-form>
          </v-container>
          <v-card-actions class="mt-n9 mr-2">
            <v-spacer></v-spacer>
            <a class="pointer" @click="forgotPassword">I forgot my password</a>
          </v-card-actions>
          <v-card-actions>
            <v-btn to="/register">Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn :loading="loading" color="primary" @click="login">
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
import { LoginMutation } from "@/graphql/mutation/auth/login.graphql";
import { LoginMutationVariables } from "@/gql/graphql";

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
        const {
          data: { login }
        } = await this.$apollo.mutate({
          mutation: LoginMutation,
          variables: {
            input: {
              username: this.username,
              password: this.password,
              totp: this.totp
            }
          } as LoginMutationVariables
        });
        localStorage.setItem("token", login.token);
        this.axios.defaults.headers.common["Authorization"] = login.token;
        await this.$user.init();
        this.$socket.auth = { token: login.token };
        this.$socket.disconnect();
        this.$socket.connect();
        if (!this.$route.query.redirect) {
          this.$router.push("/");
        } else {
          try {
            this.$router.push(this.$route.query.redirect);
          } catch {
            this.$router.push("/");
          }
        }
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
