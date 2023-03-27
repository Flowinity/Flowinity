<template>
  <v-menu
    v-model="menu.value"
    :close-on-content-click="false"
    :style="menuStyle"
  >
    <v-card>
      <v-color-picker
        @update:model-value="setThemeColor($event, menu.selected)"
        :model-value="$vuetify.theme.themes.dark.colors[menu.selected]"
        v-if="menu.selected"
      ></v-color-picker>
    </v-card>
  </v-menu>
  <template v-if="$app.themeEditor">
    <v-toolbar>
      <v-toolbar-title>
        Theme
        <v-chip size="x-small">BETA</v-chip>
      </v-toolbar-title>
      <v-btn icon @click="reset">
        <v-icon>mdi-restart</v-icon>
        <v-tooltip activator="parent" location="top">Reset</v-tooltip>
      </v-btn>
      <v-btn icon @click="$app.themeEditor = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <small class="px-4">
      <strong>Tip:</strong>
      Open with:
      <v-kbd>CTRL</v-kbd>
      +
      <v-kbd>ALT</v-kbd>
      +
      <v-kbd>E</v-kbd>
    </small>
    <v-card-title>
      <v-select
        v-model="theme"
        :items="themes"
        label="Base Theme"
        @update:modelValue="triggerSave"
        item-title="title"
        item-value="value"
      ></v-select>
    </v-card-title>
    <v-card
      color="transparent"
      elevation="0"
      class="no-border"
      :class="{ 'v-card--disabled': !$user.gold }"
    >
      <v-overlay
        :model-value="!$user.gold"
        contained
        class="align-center justify-center"
        persistent
        style="opacity: 1"
      >
        <v-card
          color="#121212"
          class="text-center no-border py-4"
          width="300"
          elevation="0"
        >
          <v-icon size="120">mdi-lock</v-icon>
          <br />
          <p class="ml-2">You need gold.</p>
        </v-card>
      </v-overlay>
      <v-card-title>
        <v-avatar
          color="primary"
          class="v-avatar--variant-outlined pointer"
          size="22"
          @click="openMenu($event, 'primary')"
        ></v-avatar>
        Accent Color
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="logo1"
          class="v-avatar--variant-outlined pointer"
          size="22"
          @click="openMenu($event, 'logo1')"
        ></v-avatar>
        Logo Gradient 1
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="logo2"
          class="v-avatar--variant-outlined pointer"
          size="22"
          @click="openMenu($event, 'logo2')"
        ></v-avatar>
        Logo Gradient 2
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="background"
          class="v-avatar--variant-outlined pointer"
          size="22"
          @click="openMenu($event, 'background')"
        ></v-avatar>
        Background 1
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="background2"
          class="v-avatar--variant-outlined pointer"
          size="22"
          @click="openMenu($event, 'background2')"
        ></v-avatar>
        Background 2
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="card"
          class="v-avatar--variant-outlined pointer"
          :class="{ 'v-btn--disabled': $app.fluidGradient }"
          size="22"
          @click="openMenu($event, 'card')"
        ></v-avatar>
        Card
      </v-card-title>
      <v-card-title>
        <v-avatar
          color="toolbar"
          class="v-avatar--variant-outlined pointer"
          :class="{ 'v-btn--disabled': $app.fluidGradient }"
          size="22"
          @click="openMenu($event, 'toolbar')"
        ></v-avatar>
        Toolbar
      </v-card-title>
      <v-card-title>
        <v-switch
          label="Transparent cards (for gradient)"
          v-model="$app.fluidGradient"
          @update:model-value="triggerSave"
        ></v-switch>
        Elevation:
        <v-slider
          v-model="elevation"
          :max="24"
          :min="0"
          :step="1"
          thumb-label
        ></v-slider>
        Gradient Offset:
        <v-slider
          v-model="gradientOffset"
          :max="2160"
          :min="0"
          :step="1"
          thumb-label
          @update:model-value="triggerSave"
        ></v-slider>
        <v-switch
          @update:model-value="triggerSave"
          label="Show on profile"
          v-model="showOnProfile"
        ></v-switch>
        <v-switch
          label="Sync across devices"
          class="mt-n6"
          v-model="deviceSync"
          @update:model-value="triggerSave"
        ></v-switch>
      </v-card-title>
      <v-btn
        class="mt-n8"
        @click="
          editor = !editor;
          $emit('editor', editor);
        "
      >
        {{ editor ? "Hide" : "Show" }} CSS Editor
      </v-btn>
      <p v-show="editor" class="mb-1">
        Save & Apply with
        <v-kbd>CTRL</v-kbd>
        +
        <v-kbd>S</v-kbd>
      </p>
      <p v-show="editor" class="mb-1">
        Toggle CSS with
        <v-kbd>CTRL</v-kbd>
        +
        <v-kbd>ALT</v-kbd>
        +
        <v-kbd>D</v-kbd>
      </p>
      <vue-monaco-editor
        v-if="editor"
        v-model:value="$user.changes.themeEngine.customCSS"
        theme="vs-dark"
        language="css"
        :options="options"
        style="height: 400px"
        class="mb-4"
      />
    </v-card>
  </template>
</template>

<script lang="ts">
import { DefaultThemes } from "@/plugins/vuetify";
import { defineComponent } from "vue";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
import { useTheme } from "@troplo/vuetify/lib/framework.mjs";

export default defineComponent({
  name: "ThemeEngineSidebar",
  components: {
    VueMonacoEditor
  },
  setup() {
    const theme = useTheme();

    return {
      toggleTheme: (themeName: string) => {
        localStorage.setItem("theme", themeName);
        theme.global.name.value = themeName;
      }
    };
  },
  data() {
    return {
      theme: useTheme().global.name,
      themes: [
        { title: "Light", value: "light" },
        { title: "Dark", value: "dark" },
        { title: "AMOLED", value: "amoled" }
      ],
      editor: false,
      options: {
        minimap: {
          enabled: false
        },
        tabSize: 2
      },
      queueSave: undefined as NodeJS.Timeout | undefined,
      bindOffset: 100,
      menu: {
        value: false,
        x: 0,
        y: 0,
        selected: "" as string,
        attach: ""
      }
    };
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.menu.y}px;
        left: ${this.menu.x + 10}px;`;
    },
    deviceSync: {
      get() {
        return this.$user.changes.themeEngine?.deviceSync ?? false;
      },
      set(value: boolean) {
        if (!this.$user.changes.themeEngine) return;
        this.$user.changes.themeEngine.deviceSync = value;
      }
    },
    showOnProfile: {
      get() {
        return this.$user.changes.themeEngine?.showOnProfile ?? false;
      },
      set(value: boolean) {
        if (!this.$user.changes.themeEngine) return;
        this.$user.changes.themeEngine.showOnProfile = value;
      }
    },
    elevation: {
      get() {
        return this.$vuetify.defaults?.VCard?.elevation;
      },
      set(value: number) {
        // TPU not initialized yet
        if (!this.$vuetify.defaults?.VCard) return;
        this.$vuetify.defaults.VCard.elevation = value;
        this.triggerSave();
      }
    },
    gradientOffset: {
      get() {
        this.bindOffset;
        return getComputedStyle(document.body)
          .getPropertyValue("--gradient-offset")
          .replace("%", "");
      },
      set(value: number) {
        this.bindOffset = value;
        document.body.style.setProperty("--gradient-offset", `${value}%`);
      }
    }
  },
  methods: {
    reset() {
      this.$vuetify.theme.themes.dark = {
        ...this.$vuetify.theme.themes.dark,
        ...new DefaultThemes().themes.dark
      };
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...new DefaultThemes().themes.light
      };
      this.$vuetify.theme.themes.amoled = {
        ...this.$vuetify.theme.themes.amoled,
        ...new DefaultThemes().themes.amoled
      };
      this.gradientOffset = "100";
      this.$app.fluidGradient = false;
      this.triggerSave();
    },
    setThemeColor(color: string, type: string) {
      if (!this.$user.gold) return;
      this.$vuetify.theme.themes.dark.colors[type] = color;
      this.$vuetify.theme.themes.light.colors[type] = color;
      this.$vuetify.theme.themes.amoled.colors[type] = color;
      this.triggerSave();
    },
    save() {
      const themeEngine = {
        ...this.$user.changes.themeEngine,
        theme: this.$vuetify.theme.themes,
        fluidGradient: this.$app.fluidGradient,
        gradientOffset: this.gradientOffset,
        defaults: this.$vuetify.defaults,
        version: 1,
        baseTheme: this.$vuetify.theme.name,
        showOnProfile: this.showOnProfile,
        deviceSync: this.deviceSync,
        customCSS: this.$user.changes.themeEngine?.customCSS ?? ""
      };
      localStorage.setItem("themeEngine", JSON.stringify(themeEngine));
      this.$user.changes.themeEngine = themeEngine as any;
      this.$user.save();
    },
    triggerSave() {
      if (this.queueSave) clearTimeout(this.queueSave);
      this.queueSave = setTimeout(() => {
        this.save();
      }, 300);
    },
    openMenu(event: MouseEvent, selected: string) {
      this.menu.x = event.clientX;
      this.menu.y = event.clientY;
      this.menu.selected = selected;
      this.menu.value = true;
    }
  },
  mounted() {
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        this.save();
      }
    });
  },
  unmounted() {
    document.removeEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        this.save();
      }
    });
  },
  watch: {
    theme() {
      this.toggleTheme(this.theme);
    }
  }
});
</script>

<style scoped></style>
