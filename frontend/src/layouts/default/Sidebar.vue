<template>
  <CoreSidebar
    v-model="$app.mainDrawer"
    app
    name="default"
    color="dark"
    :floating="true"
    :class="$app.mainDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''"
    style="z-index: 2001"
    id="main-drawer"
  >
    <p
      class="text-blue mt-4 ml-4 text-small pointer unselectable"
      v-if="$vuetify.display.mobile && $chat.isCommunications"
      @click="$app.railMode = 'communications'"
    >
      <v-icon>mdi-arrow-right</v-icon>
      {{ $t("core.sidebar.backToComms") }}
    </p>
    <v-list density="comfortable" :nav="true" class="mt-1">
      <v-list-item
        v-for="item in $app.sidebar"
        :key="item.id"
        class="mx-1 my-1 unselectable"
        style="text-transform: unset !important"
        :href="item.externalPath"
        :link="true"
        :exact="item.exact"
        :to="item.path"
        @click="handleClick(item.id)"
        :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>
          {{ item.name }}
          <v-chip
            class="pb-n2 ml-1"
            v-if="item.new && !item.warning"
            color="green"
            variant="tonal"
            size="x-small"
          >
            {{ $t("generic.new") }}
          </v-chip>
          <v-chip
            class="pb-n2 ml-1"
            v-if="item.warning"
            variant="tonal"
            size="x-small"
          >
            {{ item.warning }}
          </v-chip>
          <v-icon
            size="small"
            class="float-right"
            color="grey lighten-1"
            v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
          >
            mdi-lock
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div
        class="text-center justify-center"
        v-if="$user.user?.administrator || $user.user?.moderator"
      >
        <small class="mb-2 text-grey">
          {{ $t("core.sidebar.experiments") }}
        </small>
      </div>
      <div class="pa-2" v-if="$user.user?.subscription?.metadata?.hours">
        <v-progress-linear
          color="gold"
          :model-value="calculateJitsi"
          height="25"
          rounded
          class="text-black"
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
          height="25"
          rounded
          class="text-white"
        >
          {{ Math.ceil(calculateQuota) }}% ({{
            $functions.fileSize($user.user?.quota || 0)
          }}/{{ $functions.fileSize($user.user?.plan.quotaMax || 0) }})
        </v-progress-linear>
      </div>
    </template>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";

export default defineComponent({
  name: "Sidebar",
  components: { CoreSidebar },
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
