<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
    persistent
  >
    <v-card color="#151515">
      <template v-if="step === 1">
        <v-img src="https://i.troplo.com/i/e180024e804e.png"> </v-img>
        <v-card-subtitle class="text-center justify-center">
          This is a wizard designed to help you seamlessly migrate your existing
          TroploServices accounts.
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            color="red"
            text
            class="no-capital"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon class="mr-1"> mdi-arrow-left </v-icon> Do it later
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-arrow-right </v-icon> Get started
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 2">
        <v-img
          class="wizard-banner"
          width="1920"
          src="https://i.troplo.com/i/a99a0e3bfbed.png"
        ></v-img>
        <v-card-title class="text-center justify-center">
          Do you have a Colubrina account?
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          If you have a Colubrina account, you can migrate it to TPU
          Communications.
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn color="red" text class="no-capital" @click="step = 4">
            <v-icon class="mr-1"> mdi-close </v-icon> No
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Yes
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 3">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/a99a0e3bfbed.png"
        ></v-img>
        <v-card-title class="text-center justify-center">
          Now for your credentials...
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          Please enter your Colubrina credentials to migrate your account.
        </v-card-subtitle>
        <v-container>
          <v-text-field
            label="Username"
            outlined
            dense
            placeholder="Troplo"
            autofocus
          ></v-text-field>
          <v-text-field label="Password" outlined dense></v-text-field>
          <v-text-field
            label="2FA (if enabled)"
            outlined
            dense
            type="number"
          ></v-text-field>
        </v-container>
        <v-card-actions class="text-center justify-center">
          <v-btn color="red" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-close </v-icon> Skip
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Let's go
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 4">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/af3346db35a8.png"
        ></v-img>
        <v-card-title class="text-center justify-center">
          Import your GeoSave
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          From any compatible GeoGuess instance you may export your GeoSave and
          import it here.
        </v-card-subtitle>
        <v-container>
          <v-file-input
            label="GeoSave"
            outlined
            dense
            autofocus
            v-model="geoSave"
          ></v-file-input>
        </v-container>
        <v-card-actions class="text-center justify-center">
          <v-btn color="red" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-close </v-icon> Skip
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Let's go
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 5">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/f654e23bdd22.png"
        ></v-img>
        <v-card-title class="text-center justify-center">
          Migrate Compass account
        </v-card-title>
        <v-card-subtitle class="text-center justify-center">
          Have a Compass account? Link it to your TPU to view your calendar,
          submit learning tasks, all without leaving TPU.
        </v-card-subtitle>
        <v-container> Currently unavailable </v-container>
        <v-card-actions class="text-center justify-center">
          <v-btn color="red" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-close </v-icon> Skip
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Let's go
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 6">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/b365c2da135c.png"
        ></v-img>
        <p class="text-grey text-center justify-center">
          Receive emails right inside of TPU with TPU Mail with your own unique
          troplo.com address that represents your TPU username. Hello
          <a
            :href="
              'mailto:' + $user.user?.username.toLowerCase() + '@troplo.com'
            "
            >{{ $user.user?.username.toLowerCase() }}@troplo.com</a
          >!
        </p>
        <v-container> Currently unavailable </v-container>
        <v-card-actions class="text-center justify-center">
          <v-btn color="red" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-close </v-icon> Skip
          </v-btn>
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Let's go
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 7">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/e2442d036b4f.png"
        ></v-img>
        <v-card-subtitle class="text-center justify-center">
          Remember the new address!
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn color="primary" text class="no-capital" @click="step++">
            <v-icon class="mr-1"> mdi-check </v-icon> Next
          </v-btn>
        </v-card-actions>
      </template>
      <template v-if="step === 8">
        <v-img
          class="wizard-banner"
          width="1920"
          max-height="400"
          src="https://i.troplo.com/i/2b0f90b34cad.png"
        ></v-img>
        <v-card-subtitle class="text-center justify-center">
          You're done!
        </v-card-subtitle>
        <v-card-actions class="text-center justify-center">
          <v-btn
            color="primary"
            text
            class="no-capital"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon class="mr-1"> mdi-check </v-icon> Complete
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MigrateWizard",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      step: 1,
      geoSave: undefined as File[] | undefined
    };
  }
});
</script>

<style scoped></style>
