<template>
  <teleport
    :to="
      $chat.isCommunications && $chat.selectedChat
        ? '#communications-bottom-navigation'
        : 'body'
    "
    v-if="!$chat.isCommunications || $chat.isReady"
  >
    <div
      class="mt-3 v-bottom-navigation v-bottom-navigation--active v-bottom-navigation--grow v-theme--amoled v-bottom-navigation--density-default justify-center"
      style="background: rgb(var(--v-theme-dark)); z-index: 2001"
      :style="{
        position: $chat.isCommunications ? 'relative' : 'sticky',
        height,
        bottom: !$chat.isCommunications ? '0' : undefined
      }"
    >
      <div class="v-bottom-navigation__content">
        <v-btn
          :href="item.externalPath"
          :to="item.path"
          :exact="item.exact"
          v-for="item in displayed"
          :key="item.id"
          @click="handleClick(item.id)"
          class="rounded-0"
          :height="height"
          width="auto"
        >
          <v-badge
            :content="item.warning"
            variant="tonal"
            color="grey-darken-4"
            size="x-small"
            v-if="typeof item.warning === 'number' && item.warning > 0"
          >
            <v-icon size="22">
              {{ item.icon }}
            </v-icon>
          </v-badge>
          <v-icon v-else size="22">
            {{ item.icon }}
          </v-icon>
        </v-btn>
        <v-btn
          class="rounded-0"
          @click="drawer = !drawer"
          :active="drawer"
          :height="height"
          width="auto"
        >
          <v-icon size="22">mdi-dots-horizontal</v-icon>
        </v-btn>
      </div>
    </div>
  </teleport>
  <v-navigation-drawer
    v-model="drawer"
    location="bottom"
    :temporary="true"
    color="dark"
    :touchless="true"
    style="height: 55vh"
  >
    <p
      class="text-center mt-2 v-card-subtitle"
      v-if="$app.dialogs.selectDefaultMobile"
    >
      {{ $t("core.sidebar.quickAction") }}
    </p>
    <v-list class="mb-3">
      <v-list-item
        v-for="item in $app.sidebar"
        :key="item.id"
        :prepend-icon="item.icon"
        :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
        :to="item.path"
        :exact="item.exact"
        :href="item.externalPath"
        @click="
          $app.dialogs.selectDefaultMobile
            ? selectDefault(item.id, $event)
            : handleClick(item.id)
        "
      >
        {{ item.name }}
        <template v-slot:append>
          <v-btn
            icon
            size="small"
            @click.prevent.stop="pin(item.id)"
            :disabled="displayed.length >= visible && !displayed.includes(item)"
          >
            <v-icon>
              {{ displayed.includes(item) ? "mdi-pin-off" : "mdi-pin" }}
            </v-icon>
          </v-btn>
        </template>
        <v-chip
          class="pb-n2 ml-1"
          v-if="item.warning"
          variant="tonal"
          size="x-small"
        >
          {{ item.warning }}
        </v-chip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BottomBar",
  data() {
    return {
      drawer: false,
      bind: false,
      visible: 4
    };
  },
  computed: {
    height() {
      if (this.$chat.isCommunications) return 42;
      return 69;
    },
    displayed() {
      // bind to force reactivity
      [this.bind];
      try {
        const pins = localStorage.getItem("sidebarPins");
        if (pins) {
          const parsed = JSON.parse(pins);
          return this.$app.sidebar
            .filter((item) => parsed.includes(item.id))
            .slice(0, this.visible);
        } else {
          return this.$app.sidebar.slice(0, this.visible);
        }
      } catch {
        return this.$app.sidebar.slice(0, this.visible);
      }
    }
  },
  methods: {
    pin(id: number) {
      try {
        const pins = localStorage.getItem("sidebarPins");
        if (pins) {
          const parsed = JSON.parse(pins);
          if (parsed.includes(id)) {
            parsed.splice(parsed.indexOf(id), 1);
          } else {
            parsed.push(id);
          }
          localStorage.setItem(
            "sidebarPins",
            JSON.stringify(parsed.slice(0, this.visible))
          );
          this.bind = true;
          this.bind = false;
        } else {
          localStorage.setItem("sidebarPins", JSON.stringify([id]));
        }
      } catch {
        localStorage.setItem("sidebarPins", JSON.stringify([id]));
      }
    },
    handleClick(id: number) {
      //@ts-ignore
      const item = this.$app.sidebar.find((item) => item.id === id);
      if (item?.click) {
        item.click(this);
      }
    },
    selectDefault(id: number, event: MouseEvent | KeyboardEvent) {
      event.preventDefault();
      localStorage.setItem("quickAction", JSON.stringify(id));
      this.$app.quickAction = id;
      this.drawer = false;
      this.$nextTick(() => {
        this.drawer = false;
      });
    }
  },
  mounted() {
    if (!localStorage.getItem("sidebarPins")) {
      localStorage.setItem(
        "sidebarPins",
        JSON.stringify([1, 6, this.$app.site.features.collections ? 7 : 2])
      );
      this.bind = true;
      this.bind = false;
    }
  },
  watch: {
    "$app.dialogs.selectDefaultMobile"() {
      this.drawer = true;
    },
    drawer(val) {
      if (this.$app.dialogs.selectDefaultMobile && !val) {
        this.$app.dialogs.selectDefaultMobile = false;
      }
    }
  }
});
</script>

<style scoped></style>
