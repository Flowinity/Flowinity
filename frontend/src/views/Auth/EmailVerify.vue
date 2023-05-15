<template>
  <v-container class="center-container" fluid>
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
          <v-container v-if="!error" class="text-center">
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
import {defineComponent} from "vue"

export default defineComponent({
  name: "EmailVerify",
  data() {
    return {
      loading: false,
      error: false
    }
  },
  methods: {
    async verify() {
      this.loading = true
      this.error = false
      try {
        await this.axios.patch("/user/verification", {
          token: this.$route.params.token
        })
        this.$toast.success("Email verified successfully!")
        this.$router.push("/login")
        this.$user.init()
      } catch {
        this.loading = false
        this.error = true
      }
    }
  },
  mounted() {
    this.$app.title = "Email Verify"
    this.verify()
  }
})
</script>
