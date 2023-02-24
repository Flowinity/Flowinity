<template>
  <v-menu
    min-width="300"
    max-height="500"
    @update:model-value="dismissNotifications"
    :close-on-content-click="false"
    activator="parent"
    class="rounded-xl"
    style="z-index: 2001"
    location="bottom center"
  >
    <v-card>
      <v-toolbar>
        <v-spacer></v-spacer>
        Notifications
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list class="rounded-0">
        <template v-for="item in $user.user?.notifications" :key="item.id">
          <v-list-item
            two-line
            :class="{
              highlighted: !item.dismissed,
              unhighlight: item.dismissed
            }"
            :to="item.route"
          >
            {{ item.message }}
            <v-list-item-subtitle class="mt-1">
              {{ $date().to(item.createdAt) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
        </template>
        <v-list-item v-if="!$user.user?.notifications.length">
          <div class="justify-center text-center">
            <v-icon size="100" color="#606060">mdi-tooltip-check</v-icon>
            <h3 style="opacity: 0.7">You're up to date!</h3>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Notifications",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    async dismissNotifications(e: boolean) {
      if (e) return;
      await this.axios.patch("/user/notifications");
      this.$user.user?.notifications.forEach((notification) => {
        notification.dismissed = true;
      });
    }
  }
});
</script>

<style scoped></style>
