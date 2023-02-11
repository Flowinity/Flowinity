<template>
  <v-app-bar color="dark" app density="comfortable" floating flat>
    <h1
      style="z-index: 10; cursor: pointer; font-size: 32px"
      class="text-gradient unselectable ml-4"
      @click="$router.push('/')"
      id="tpu-brand-logo"
      title="TroploPrivateUploader (TPUvNEXT Alpha)"
    >
      TPU
    </h1>
    <v-spacer></v-spacer>
    <v-btn color="primary" to="/login"> Login </v-btn>
    <v-btn color="primary" to="/register"> Register </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user";
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  components: { UserAvatar },
  computed: {
    ...mapStores(useUserStore),
    dropdown() {
      if (!this.userStore.user) return [];
      return [
        {
          id: 12,
          click() {},
          path: "/u/" + this.userStore.user.username,
          name: this.userStore.user.username,
          disabled: false
        },
        {
          id: 13,
          click() {},
          path: "",
          name: "Toggle Theme",
          disabled: false
        },
        {
          id: 15,
          click() {},
          path: "",
          name: "Logout",
          disabled: false
        }
      ];
    }
  },
  methods: {
    handleClickDropdown(index: number) {
      this.dropdown[index].click.call(this);
    }
  },
  mounted() {
    console.log(this.userStore.user);
  }
});
</script>
