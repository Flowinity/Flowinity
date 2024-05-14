<template>
  <CoreDialog
    :model-value="modelValue"
    width="700"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Provide Feedback to {{ $app.site.name }}</template>
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
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="text"
              class="rounded-xl"
              label="Enter your Feedback"
              required
            />
          </v-col>
          <small>
            Your feedback will be used to make
            {{ $app.site.name }} better.
            <br />
            <br />
            <template v-if="!$app.site.officialInstance">
              This is a third-party instance of Flowinity. Feedback will be
              submitted to the instance administrators, and to the official
              Flowinity instance, some information may be recorded such as
              current instance and user ID to improve your experience.
            </template>
          </small>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        class="rounded-xl"
        color="blue darken-1"
        @click="$emit('update:modelValue', false)"
      >
        Close
      </v-btn>
      <v-btn class="rounded-xl" color="blue darken-1" @click="submitFeedback()">
        Submit
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
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
      this.$toast.success(
        `Feedback submitted. Thank you for making ${this.$app.site.name} better!`
      );
    }
  }
});
</script>
