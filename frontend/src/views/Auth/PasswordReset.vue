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
            <v-form v-model="valid">
              <v-text-field
                v-model="password"
                :rules="$validation.user.password"
                :autofocus="true"
                label="New Password"
                type="password"
                @keydown.enter="recover"
              />
              <v-text-field
                v-model="confirmPassword"
                :rules="[...$validation.user.password, ...validation]"
                label="Confirm New Password"
                type="password"
                @keydown.enter="recover"
              />
            </v-form>
          </v-container>
          <v-card-actions>
            <v-btn to="/login">Login</v-btn>
            <v-spacer />
            <v-btn
              :disabled="!valid"
              :loading="loading"
              color="primary"
              @click="recover"
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
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";

export default defineComponent({
  name: "Login",
  components: { FlowinityBanner },
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
  mounted() {
    this.$app.title = "Password Reset";
    this.code = this.$route.params.code as string;
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
  }
});
</script>
