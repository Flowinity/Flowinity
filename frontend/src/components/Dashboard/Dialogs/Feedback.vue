<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="700"
  >
    <v-card class="rounded-xl" elevation="7">
      <v-toolbar>
        <v-toolbar-title>Provide Feedback to TPU</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" sm="6">
              Rating:
              <v-rating
                v-model="rating"
                background-color="grey darken-1"
                color="yellow darken-3"
                hover
              ></v-rating>
            </v-col>
            <v-col cols="12">
              <v-textarea
                class="rounded-xl"
                v-model="text"
                label="Enter your Feedback"
                required
              ></v-textarea>
            </v-col>
            <small>
              Your feedback will be used to make
              {{ $app.site.name }} better.
            </small>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="rounded-xl"
          color="blue darken-1"
          text
          @click="$emit('update:modelValue', false)"
        >
          Close
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="blue darken-1"
          text
          @click="submitFeedback()"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Feedback",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      rating: 0,
      text: ""
    };
  },
  methods: {
    async submitFeedback() {
      await this.axios.post("/user/feedback", {
        route: this.$route.path,
        starRating: this.rating,
        text: this.text
      });
      this.$emit("update:modelValue", false);
      this.$toast.success("Feedback submitted, thanks for making TPU better!");
    }
  }
});
</script>

<style scoped></style>
