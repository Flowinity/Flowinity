<template>
  <v-bottom-navigation
    :grow="true"
    style="background: rgb(var(--v-theme-dark))"
  >
    <v-btn
      :to="item.path"
      :exact="item.exact"
      v-for="item in displayed"
      :key="item.id"
      @click="handleClick(item.id)"
    >
      <v-badge
        :content="item.warning"
        variant="tonal"
        color="grey-darken-4"
        size="x-small"
        v-if="typeof item.warning === 'number' && item.warning > 0"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-badge>
      <v-icon v-else>
        {{ item.icon }}
      </v-icon>
      {{ item.name }}
    </v-btn>
    <v-btn @click="drawer = !drawer" :active="drawer">
      <v-icon>mdi-dots-horizontal</v-icon>
      More
    </v-btn>
  </v-bottom-navigation>
  <v-navigation-drawer
    v-model="drawer"
    location="bottom"
    :temporary="true"
    color="dark"
    :touchless="true"
  >
    <v-list>
      <v-list-item
        v-for="item in $app.sidebar"
        :key="item.id"
        :prepend-icon="item.icon"
        :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
        :to="item.path"
        :exact="item.exact"
        @click="handleClick(item.id)"
      >
        {{ item.name }}
        <template v-slot:append>
          <v-btn
            icon
            size="small"
            @click.prevent.stop="pin(item.id)"
            :disabled="displayed.length >= 4 && !displayed.includes(item)"
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
      bind: false
    };
  },
  computed: {
    displayed() {
      [this.bind];
      try {
        const pins = localStorage.getItem("sidebarPins");
        if (pins) {
          const parsed = JSON.parse(pins);
          return this.$app.sidebar
            .filter((item) => parsed.includes(item.id))
            .slice(0, 4);
        } else {
          return this.$app.sidebar.slice(0, 4);
        }
      } catch {
        return this.$app.sidebar.slice(0, 4);
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
            JSON.stringify(parsed.slice(0, 4))
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
  }
});
</script>

<style scoped></style>
