<template>
  <v-menu
    v-model="menu.value"
    :close-on-content-click="false"
    :style="menuStyle"
  >
    <v-card>
      <v-color-picker
        v-if="menu.selected"
        :model-value="
          menu.selected === 'nameColor'
            ? $user.changes.nameColor
            : $vuetify.theme.themes.dark.colors[menu.selected]
        "
        mode="hex"
        @update:model-value="setThemeColor($event, menu.selected)"
      ></v-color-picker>
      <v-btn
        :block="true"
        v-if="menu.selected === 'nameColor'"
        @click="setThemeColor(null, menu.selected)"
      >
        Reset
      </v-btn>
    </v-card>
  </v-menu>
  <template v-if="$app.themeEditor">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("themeEditor.title") }}
        <v-chip size="x-small">
          {{ $t("generic.beta") }}
        </v-chip>
      </v-toolbar-title>
      <v-btn icon @click="reset">
        <v-icon>mdi-restart</v-icon>
        <v-tooltip activator="parent" location="top">
          {{ $t("themeEditor.reset") }}
        </v-tooltip>
      </v-btn>
      <v-btn icon @click="$app.themeEditor = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <small class="px-4">
      <strong>
        {{ $t("themeEditor.tip") }}
      </strong>
      {{ $t("themeEditor.tipText") }}
      <v-kbd>CTRL</v-kbd>
      +
      <v-kbd>ALT</v-kbd>
      +
      <v-kbd>E</v-kbd>
    </small>
    <v-alert
      v-if="(theme === 'amoled' && $user.gold) || !$app.site.officialInstance"
      class="mb-4 mt-4"
      type="warning"
      variant="tonal"
    >
      {{ $t("themeEditor.compatibilityWarning") }}
    </v-alert>
    <v-card-title>
      <v-select
        v-model="theme"
        :items="themes"
        item-title="title"
        item-value="value"
        label="Base Theme"
        @update:modelValue="triggerSave"
      ></v-select>
    </v-card-title>
    <v-card
      :class="{ 'v-card--disabled': !$user.gold && $app.site.officialInstance }"
      class="no-border"
      color="transparent"
      elevation="0"
    >
      <v-overlay
        :model-value="!$user.gold && $app.site.officialInstance"
        class="align-center justify-center"
        contained
        persistent
        style="opacity: 1"
      >
        <v-card
          class="text-center no-border py-4"
          color="#121212"
          elevation="0"
          width="300"
        >
          <v-icon size="120">mdi-lock</v-icon>
          <br />
          <p class="ml-2">
            {{ $t("themeEditor.gold") }}
          </p>
        </v-card>
      </v-overlay>
      <v-card-title>
        <v-avatar
          class="v-avatar--variant-outlined pointer"
          color="primary"
          size="22"
          @click="openMenu($event, 'primary')"
        ></v-avatar>
        {{ $t("themeEditor.colors.primary") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          class="v-avatar--variant-outlined pointer"
          color="logo1"
          size="22"
          @click="openMenu($event, 'logo1')"
        ></v-avatar>
        {{ $t("themeEditor.colors.logo1") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          class="v-avatar--variant-outlined pointer"
          color="logo2"
          size="22"
          @click="openMenu($event, 'logo2')"
        ></v-avatar>
        {{ $t("themeEditor.colors.logo2") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          class="v-avatar--variant-outlined pointer"
          color="background"
          size="22"
          @click="openMenu($event, 'background')"
        ></v-avatar>
        {{ $t("themeEditor.colors.background") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          class="v-avatar--variant-outlined pointer"
          color="background2"
          size="22"
          @click="openMenu($event, 'background2')"
        ></v-avatar>
        {{ $t("themeEditor.colors.background2") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          :class="{ 'v-btn--disabled': $app.fluidGradient }"
          class="v-avatar--variant-outlined pointer"
          color="card"
          size="22"
          @click="openMenu($event, 'card')"
        ></v-avatar>
        {{ $t("themeEditor.colors.card") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          :class="{ 'v-btn--disabled': $app.fluidGradient }"
          class="v-avatar--variant-outlined pointer"
          color="toolbar"
          size="22"
          @click="openMenu($event, 'toolbar')"
        ></v-avatar>
        {{ $t("themeEditor.colors.toolbar") }}
      </v-card-title>
      <v-card-title>
        <v-avatar
          :class="{ 'v-btn--disabled': $app.fluidGradient }"
          class="v-avatar--variant-outlined pointer"
          :color="$user.changes.nameColor"
          size="22"
          @click="openMenu($event, 'nameColor')"
        ></v-avatar>
        {{ $t("themeEditor.colors.nameColor") }}
        <v-chip size="x-small">
          {{ $t("generic.new") }}
        </v-chip>
      </v-card-title>
      <v-card-title>
        <v-switch
          v-model="$app.fluidGradient"
          :label="$t('themeEditor.attributes.fluidGradient')"
          @update:model-value="triggerSave"
        ></v-switch>
        {{ $t("themeEditor.attributes.elevation") }}:
        <v-slider
          v-model="elevation"
          :max="24"
          :min="0"
          :step="1"
          thumb-label
        ></v-slider>
        {{ $t("themeEditor.attributes.gradientOffset") }}:
        <v-slider
          v-model="gradientOffset"
          :max="2160"
          :min="0"
          :step="1"
          thumb-label
          @update:model-value="triggerSave"
        ></v-slider>
        <v-switch
          v-model="showOnProfile"
          :label="$t('themeEditor.attributes.showOnProfile')"
          @update:model-value="triggerSave"
        ></v-switch>
        <v-switch
          v-model="deviceSync"
          class="mt-n6"
          :label="$t('themeEditor.attributes.deviceSync')"
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
        {{
          editor
            ? $t("themeEditor.cssEditor.hide")
            : $t("themeEditor.cssEditor.show")
        }}
      </v-btn>
      <p v-show="editor" class="mb-1">
        {{ $t("themeEditor.cssEditor.saveShortcut") }}
        <v-kbd>CTRL</v-kbd>
        +
        <v-kbd>S</v-kbd>
      </p>
      <p v-show="editor" class="mb-1">
        {{ $t("themeEditor.cssEditor.toggleShortcut") }}
        <v-kbd>CTRL</v-kbd>
        +
        <v-kbd>ALT</v-kbd>
        +
        <v-kbd>D</v-kbd>
      </p>
      <vue-monaco-editor
        v-if="editor"
        v-model:value="$user.changes.themeEngine.customCSS"
        :options="options"
        class="mb-4"
        language="css"
        style="height: 400px"
        theme="vs-dark"
      />
    </v-card>
  </template>
</template>

<script lang="ts">
import { DefaultThemes } from "@/plugins/vuetify";
import { defineComponent } from "vue";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
import { useTheme } from "vuetify/lib/framework.mjs";

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
        return <number>this.$vuetify.defaults?.VCard?.elevation;
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
      if (!this.$user.gold && this.$app.site.officialInstance) return;
      if (type === "nameColor") {
        this.$user.changes.nameColor = color;
        this.triggerSave();
        return;
      }
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
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "s" &&
        this.$app.themeEditor
      ) {
        event.preventDefault();
        this.save();
      }
    });
  },
  unmounted() {
    document.removeEventListener("keydown", (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "s" &&
        this.$app.themeEditor
      ) {
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
