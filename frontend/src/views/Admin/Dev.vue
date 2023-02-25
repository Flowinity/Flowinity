<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Dev</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-btn @click="crash">Crash SPA</v-btn>
        <v-btn @click="acceptFriends">Accept all friend requests</v-btn>
      </v-card-text>
      <v-card-text>
        <v-card-title>Send email</v-card-title>
        <v-text-field v-model="email" label="Email" />
        <v-text-field v-model="subject" label="Subject" />
        <v-textarea v-model="body" label="Body" auto-grow />
        <v-btn @click="sendEmail">Send</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dev",
  data() {
    return {
      email: "troplo@troplo.com",
      subject: "Colubrina is now TPU",
      body: JSON.stringify(
        {
          body: {
            intro: `<style>h3, p {color: white !important;} table, tr, td { background-color: #151515 !important; }</style> <img width="500" src="https://i.troplo.com/i/2950e49a89f6.png" alt="Colubrina has a new home! Colubrina to TPU." />`,
            title: `Colubrina has a new home!`,
            description: `Colubrina is now TPU!`,
            action: [
              {
                intro: `Create your TPU account`,
                instructions:
                  "After creating, you can migrate your Colubrina account in a few simple steps",
                button: {
                  color: "#0190ea", // Optional action button color
                  text: "Create account",
                  link: "https://images.flowinity.com/register"
                }
              }
            ]
          }
        },
        null,
        2
      )
    };
  },
  methods: {
    async sendEmail() {
      await this.axios.post("/admin/dev/email", {
        to: this.email,
        subject: this.subject,
        email: JSON.parse(this.body)
      });
      this.$toast.success("OK");
    },
    crash() {
      throw new Error("Crash");
    },
    async acceptFriends() {
      await this.axios.patch("/admin/dev/friendAccept");
      this.$toast.success("OK");
    }
  }
});
</script>

<style scoped></style>
