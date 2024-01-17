<template>
  <v-container class="center-container" :fluid="true">
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
        >
          <div
            class="d-flex justify-center mt-4"
            v-if="$experiments.experiments.FLOWINITY"
          >
            <FlowinityBanner style="width: 256px"></FlowinityBanner>
          </div>
          <p
            v-else
            class="text-center text-gradient mt-2"
            :style="
              $vuetify.display.mobile ? 'font-size: 38px' : 'font-size: 48px'
            "
          >
            {{ $app.site?.name || "Flowinity" }}
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
            <v-spacer />
            <a class="pointer" @click="forgotPassword">I forgot my password</a>
          </v-card-actions>
          <v-card-actions>
            <v-btn to="/register">Register</v-btn>
            <v-spacer />
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
import { LoginMutation } from "@/graphql/auth/login.graphql";
import { LoginMutationVariables } from "@/gql/graphql";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";

export default defineComponent({
  name: "Login",
  components: { FlowinityBanner },
  data() {
    return {
      username: "",
      password: "",
      totp: "",
      loading: false
    };
  },
  mounted() {
    this.$app.title = "Login";
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
        await localStorage.setItem("token", login.token);
        this.axios.defaults.headers.common["Authorization"] = login.token;
        this.$app.token = login.token;
        await this.$app.init();
        this.$app.reconnectSocket(login.token);
        if (!this.$route.query.redirect) {
          this.$router.push("/");
        } else {
          try {
            this.$router.push(this.$route.query.redirect);
          } catch {
            this.$router.push("/");
          }
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    }
  }
});
</script>
