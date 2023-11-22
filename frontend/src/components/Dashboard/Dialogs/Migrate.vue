<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700px"
    :persistent="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card color="#151515">
      <template
        v-if="step === 1 && $experiments.experiments['CLASSIC_MIGRATE']"
      >
        <v-img src="https://i.troplo.com/i/e180024e804e.png" />
        <v-card-subtitle class="text-center justify-center">
          This is a wizard designed to help you seamlessly migrate your existing
          TroploServices accounts.
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            class="no-capital"
            color="red"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Do it later
          </v-btn>
          <v-btn class="no-capital" color="primary" @click="step++">
            <v-icon class="mr-1">mdi-arrow-right</v-icon>
            Get started
          </v-btn>
        </v-card-actions>
      </template>
      <template v-else-if="step === 1">
        <v-img src="https://i.troplo.com/i/888e1eac2f56.png" />
        <v-card-subtitle class="text-center justify-center">
          This is a wizard designed to help you seamlessly migrate your
          Colubrina account.
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            class="no-capital"
            color="red"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Do it later
          </v-btn>
          <v-btn class="no-capital" color="primary" @click="step++">
            <v-icon class="mr-1">mdi-arrow-right</v-icon>
            Get started
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 2">
        <v-img
          class="wizard-banner"
          src="https://i.troplo.com/i/a99a0e3bfbed.png"
          width="1920"
        />
        <v-card-title class="text-center justify-center">
          Do you have a Colubrina account?
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          If you have a Colubrina account, you can migrate it to TPU
          Communications.
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            class="no-capital"
            color="red"
            @click="
              $experiments.experiments['CLASSIC_MIGRATE']
                ? (step = 4)
                : (step = 8)
            "
          >
            <v-icon class="mr-1">mdi-close</v-icon>
            No
          </v-btn>
          <v-btn class="no-capital" color="primary" @click="step++">
            <v-icon class="mr-1">mdi-check</v-icon>
            Yes
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 3">
        <v-img
          class="wizard-banner"
          max-height="400"
          src="https://i.troplo.com/i/a99a0e3bfbed.png"
          width="1920"
        />
        <v-card-title class="text-center justify-center">
          Now for your credentials...
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          Please enter your Colubrina credentials to migrate your account.
        </v-card-subtitle>
        <v-container>
          <v-text-field
            v-model="colubrina.username"
            :autofocus="true"
            dense
            label="Username"
            outlined
            placeholder="Troplo"
            @keyup.enter="checkColubrina"
          />
          <v-text-field
            v-model="colubrina.password"
            dense
            label="Password"
            outlined
            type="password"
            @keyup.enter="checkColubrina"
          />
          <v-text-field
            v-model="colubrina.totp"
            dense
            label="2FA (if enabled)"
            outlined
            type="number"
            @keyup.enter="checkColubrina"
          />
        </v-container>
        <v-card-actions class="text-center justify-center">
          <v-btn
            class="no-capital"
            color="red"
            @click="
              $experiments.experiments['CLASSIC_MIGRATE']
                ? (step = 7)
                : (step = 8)
            "
          >
            <v-icon class="mr-1">mdi-close</v-icon>
            Skip
          </v-btn>
          <v-btn
            :loading="colubrina.loading"
            class="no-capital"
            color="primary"
            @click="checkColubrina"
          >
            <v-icon class="mr-1">mdi-check</v-icon>
            Let's go
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 7">
        <v-img
          class="wizard-banner"
          max-height="400"
          src="https://i.troplo.com/i/e2442d036b4f.png"
          width="1920"
        />
        <v-card-subtitle class="text-center justify-center">
          Remember the new address!
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn class="no-capital" color="primary" @click="step++">
            <v-icon class="mr-1">mdi-check</v-icon>
            Next
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 8">
        <v-img
          class="wizard-banner"
          max-height="400"
          src="https://i.troplo.com/i/2b0f90b34cad.png"
          width="1920"
        />
        <v-card-subtitle class="text-center justify-center">
          You're done!
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            class="no-capital"
            color="primary"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon class="mr-1">mdi-check</v-icon>
            Complete
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      step: 1,
      geoSave: undefined as File[] | undefined,
      colubrina: {
        username: "",
        password: "",
        totp: "",
        loading: false
      }
    };
  },
  methods: {
    async checkColubrina() {
      this.colubrina.loading = true;
      try {
        await this.axios.post("/migrate/colubrina", {
          username: this.colubrina.username,
          password: this.colubrina.password,
          totp: this.colubrina.totp
        });
        if (this.$experiments.experiments["CLASSIC_MIGRATE"]) this.step++;
        else this.step = 8;
        this.colubrina.loading = false;
      } catch {
        this.colubrina.loading = false;
      }
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (!val) this.step = 1;
      }
    }
  }
});
</script>
