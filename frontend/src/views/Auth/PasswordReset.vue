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
            <v-form v-model="valid">
              <v-text-field
                label="New Password"
                v-model="password"
                autofocus
                type="password"
                @keydown.enter="recover"
                :rules="$validation.user.password"
              />
              <v-text-field
                label="Confirm New Password"
                type="password"
                v-model="confirmPassword"
                @keydown.enter="recover"
                :rules="[...$validation.user.password, ...validation]"
              />
            </v-form>
          </v-container>
          <v-card-actions>
            <v-btn to="/login">Login</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="recover"
              :loading="loading"
              :disabled="!valid"
            >
              Recover Account
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
      confirmPassword: "",
      password: "",
      code: "",
      loading: false,
      validation: [
        (value: string) => {
          //@ts-ignore
          if (value !== this.password) return "Passwords do not match";
          return true;
        }
      ],
      valid: false
    };
  },
  methods: {
    async recover() {
      this.loading = true;
      try {
        await this.axios.patch("/auth/recover", {
          password: this.password,
          code: this.code
        });
        this.$router.push("/login");
        this.$toast.success(
          "Your password has been changed successfully, you can login now!"
        );
      } catch {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.$app.title = "Password Reset";
    this.code = this.$route.params.code as string;
  }
});
</script>
