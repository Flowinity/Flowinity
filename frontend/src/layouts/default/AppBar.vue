<template>
  <v-app-bar
    color="dark"
    app
    density="comfortable"
    floating
    :class="{
      'header-patch': $app.mainDrawer && !$vuetify.display.mobile,
      'header-patch-workspaces':
        $app.workspaceDrawer && !$vuetify.display.mobile
    }"
    flat
    style="z-index: 2001"
  >
    <v-app-bar-nav-icon
      style="z-index: 1000"
      v-if="$vuetify.display.mobile"
      @click.stop="$app.mainDrawer = !$app.mainDrawer"
    ></v-app-bar-nav-icon>
    <h1
      style="z-index: 10; cursor: pointer; font-size: 32px"
      class="text-gradient unselectable ml-4"
      @click="$router.push('/')"
      id="tpu-brand-logo"
      title="TroploPrivateUploader"
    >
      TPU
    </h1>
    <v-spacer></v-spacer>
    <template v-if="!userStore.user">
      <v-btn
        color="primary"
        text
        @click="$router.push('/login')"
        :disabled="$route.path === '/login'"
      >
        Login
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="$router.push('/register')"
        :disabled="$route.path === '/register'"
      >
        Register
      </v-btn>
    </template>
    <template v-else>
      <v-menu offset-y rounded class="rounded-xxl">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="rounded-xl" icon v-bind="attrs" v-on="on">
            <UserAvatar :user="userStore.user" size="38" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in dropdown"
            :key="item.id"
            :disabled="item.disabled"
            :to="item.path"
            @click="handleClickDropdown(index)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        icon
        class="ml-2"
        @click="$app.workspaceDrawer = true"
        v-if="!$app.workspaceDrawer"
      >
        <v-icon>mdi-menu-open</v-icon>
      </v-btn>
    </template>
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
