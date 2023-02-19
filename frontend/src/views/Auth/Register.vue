<template>
  <v-container
    fluid
    class="center-container"
    v-if="inviter || $app.site.registrations"
  >
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
            <v-form v-model="form">
              <v-text-field
                label="Username"
                v-model="username"
                autofocus
                @keydown.enter="login"
                :rules="$validation.user.username"
              />
              <v-text-field
                label="Email"
                v-model="email"
                autofocus
                @keydown.enter="login"
                :rules="$validation.user.email"
              />
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                @keydown.enter="login"
                :rules="$validation.user.password"
              />
              <v-checkbox v-model="terms" :rules="$validation.user.terms">
                <template v-slot:label>
                  <span>I agree to the</span>
                  <router-link
                    to="/policies/content"
                    style="text-decoration: none; color: #0190ea"
                  >
                    &nbsp;TPU Content Policy
                  </router-link>
                </template>
              </v-checkbox>
            </v-form>
            <small>Fun Fact: {{ fact }}</small>
          </v-container>
          <v-card-actions>
            <v-btn to="/login">Login</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="login"
              :loading="loading"
              :disabled="!form"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container
    fluid
    class="center-container"
    v-else-if="!$app.componentLoading"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="7" xl="5">
        <v-card
          :flat="$vuetify.display.mobile"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          class="text-center"
        >
          <p class="text-center text-gradient mb-n5" style="font-size: 64px">
            TPU
          </p>
          <v-card-text>
            TPU is currently not accepting registrations.
            <br />
            If you'd like to join, you need to be invited by a current member.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Register",
  data() {
    return {
      terms: false,
      form: false,
      username: "",
      password: "",
      email: "",
      inviteKey: "",
      loading: false,
      inviter: null as { username: string; id: number } | null,
      facts: [] as string[],
      fact: ""
    };
  },
  methods: {
    async getInviteKey() {
      if (this.$route.params.key) {
        this.$app.componentLoading = true;
        const { data } = await this.axios.get(
          `/invites/${this.$route.params.key}`
        );
        this.email = data.email;
        this.inviter = {
          username: data.user.username,
          id: data.user.id
        };
        this.facts = data.facts;
        this.fact = this.facts[Math.floor(Math.random() * this.facts.length)];
        setInterval(() => {
          const fact = this.fact;
          this.fact = this.facts[Math.floor(Math.random() * this.facts.length)];
          if (fact === this.fact) {
            this.fact =
              this.facts[Math.floor(Math.random() * this.facts.length)];
          }
        }, 5000);
        this.$app.componentLoading = false;
      }
    },
    async login() {
      this.loading = true;
      try {
        const { data } = await this.axios.post("/auth/register", {
          username: this.username,
          password: this.password,
          email: this.email,
          inviteKey: this.inviteKey
        });

        localStorage.setItem("token", data.token);
        this.axios.defaults.headers.common["Authorization"] = data.token;
        await this.$user.init();
        this.$router.push("/");
        this.$toast.success("You have been registered, welcome to TPU!", {
          timeout: 3000,
          type: "success"
        });
      } catch {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.$app.title = "Register";
    this.inviteKey = this.$route.params.key as string;
    this.getInviteKey();
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
