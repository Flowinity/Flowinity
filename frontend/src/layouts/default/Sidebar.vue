<template>
  <v-navigation-drawer
    id="main-drawer"
    v-model="$app.mainDrawer"
    :class="$app.mainDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''"
    :floating="true"
    app
    color="dark"
    style="z-index: 2001"
  >
    <v-list :nav="true" class="mt-1" density="comfortable">
      <v-list-item
        v-for="item in $app.sidebar"
        :key="item.id"
        :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
        :exact="item.exact"
        :href="item.externalPath"
        :link="true"
        :prepend-icon="item.icon"
        :to="item.path"
        class="ml-1 my-1 unselectable"
        style="text-transform: unset !important"
        @click="handleClick(item.id)"
      >
        <v-list-item-title>
          {{ item.name }}
          <v-chip
            v-if="item.new && !item.warning"
            class="pb-n2 ml-1"
            color="green"
            size="x-small"
            variant="tonal"
          >
            NEW
          </v-chip>
          <v-chip
            v-if="item.warning"
            class="pb-n2 ml-1"
            size="x-small"
            variant="tonal"
          >
            {{ item.warning }}
          </v-chip>
          <v-icon
            v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
            class="float-right"
            color="grey lighten-1"
            size="small"
          >
            mdi-lock
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div
        v-if="$user.user?.administrator || $user.user?.moderator"
        class="text-center justify-center"
      >
        <small class="mb-2 text-grey">
          {{ $t("core.sidebar.experiments") }}
        </small>
      </div>
      <div v-if="$user.user?.subscription?.metadata?.hours" class="pa-2">
        <v-progress-linear
          :model-value="calculateJitsi"
          class="text-black"
          color="gold"
          height="25"
          rounded
        >
          {{ calculateJitsi }}% ({{
            Math.round($user.user?.subscription?.metadata?.hours)
          }}h/8h)
        </v-progress-linear>
      </div>
      <div class="pa-2">
        <v-progress-linear
          :color="calculateColorQuota"
          :value="calculateQuota"
          class="text-white"
          height="25"
          rounded
        >
          {{ Math.ceil(calculateQuota) }}% ({{
            $functions.fileSize($user.user?.quota || 0)
          }}/{{ $functions.fileSize($user.user?.plan.quotaMax || 0) }})
        </v-progress-linear>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Sidebar",
  data() {
    return {
      order: []
    };
  },
  computed: {
    calculateQuota() {
      if (!this.$user.user) return 0;
      return (this.$user.user?.quota / this.$user.user?.plan?.quotaMax) * 100;
    },
    calculateColorQuota() {
      if (this.calculateQuota >= 80 && this.calculateQuota < 95) {
        return "warning";
      } else if (this.calculateQuota >= 95) {
        return "error";
      } else {
        return "success";
      }
    },
    calculateJitsi() {
      return (
        Math.round(
          (this.$user.user?.subscription?.metadata?.hours / 8) * 100
        ) || 0
      );
    }
  },
  methods: {
    handleClick(id: number) {
      //@ts-ignore
      const item = this.$app.sidebar.find((item) => item.id === id);
      if (item?.click) {
        item.click(this);
      }
    }
  }
});
</script>
