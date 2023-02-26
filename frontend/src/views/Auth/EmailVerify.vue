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
          <v-container class="text-center" v-if="!error">
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="48"
            ></v-progress-circular>
            <v-card-title>Verifying email...</v-card-title>
          </v-container>
          <v-container v-else class="text-center">
            <v-card-title>Failed to verify email!</v-card-title>
            <v-card-text>
              Try re-sending the email or trying again later.
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmailVerify",
  data() {
    return {
      loading: false,
      error: false
    };
  },
  methods: {
    async verify() {
      this.loading = true;
      this.error = false;
      try {
        await this.axios.patch("/user/verification", {
          token: this.$route.params.token
        });
        this.$toast.success("Email verified successfully!");
        this.$router.push("/login");
        this.$user.init();
      } catch {
        this.loading = false;
        this.error = true;
      }
    }
  },
  mounted() {
    this.$app.title = "Email Verify";
    this.verify();
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
