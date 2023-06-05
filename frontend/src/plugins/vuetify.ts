  /**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
//import "@troplo/vuetify/styles";
//import "/home/troplo/GitHub/vuetify/packages/vuetify/src/styles/main.sass";
import "vuetify/lib/styles/main.sass";
// Composables
import {
  createVuetify,
  IconSet,
  IconProps
} from "/home/troplo/GitHub/vuetify/packages/vuetify/dist/vuetify.esm";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VInfiniteScroll } from "vuetify/lib/labs/components.mjs";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { VVirtualScroll } from "vuetify/lib/components/index.mjs";
import { VNavigationDrawer } from "/home/troplo/GitHub/vuetify/packages/vuetify/lib/components/index.mjs";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as simpleIcons from "simple-icons";
import { h } from "vue";

export class DefaultThemes {
  themes: any;

  constructor(gold: boolean = false) {
    this.themes = {
      dark: {
        colors: {
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#161616",
          toolbar: "#191919",
          sheet: "#151515",
          text: "#FFFFFF",
          dark: "#151515",
          background: "#121212",
          background2: "#121212",
          gold: "#ffd700"
        }
      },
      amoled: {
        colors: {
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#000000",
          toolbar: "#121212",
          sheet: "#000000",
          text: "#FFFFFF",
          dark: "#000000",
          gold: "#ffd700",
          background: "#000000",
          background2: "#000000"
        },
        dark: true
      },
      light: {
        colors: {
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#121212",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4caf50",
          warning: "#ff9800",
          card: "#ffffff",
          toolbar: "#f5f5f5",
          sheet: "#fafafa",
          text: "#000000",
          dark: "#f7f7f7",
          background: "#f5f5f5",
          background2: "#f5f5f5",
          gold: "#ffd700"
        }
      }
    };
  }
}

const si: IconSet = {
  component: (props: IconProps) =>
    h(
      "svg",
      {
        fill: vuetify.theme.current.value.dark ? "#ffffff" : "#000000"
      },
      [
        h("path", {
          //@ts-ignore
          d: simpleIcons[props.icon]?.path || "",
          "shape-rendering": "optimizeQuality"
        })
      ]
    )
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      si
    }
  },
  components: {
    VDataTable,
    VSkeletonLoader,
    VVirtualScroll,
    VNavigationDrawer
    VInfiniteScroll
  },
  display: {
    thresholds: {
      xl: 1600
    }
  },
  defaults: {
    VAutoComplete: {
      variant: "underlined",
      color: "primary"
    },
    VDialog: {},
    VDataTable: {
      fixedHeader: true,
      noDataText: "No entries yet..."
    },
    VTable: {
      color: "card"
    },
    VCard: {
      elevation: 6,
      color: "card",
      rounded: "xl"
    },
    VExpansionPanels: {
      color: "card"
    },
    VExpansionPanel: {
      color: "toolbar"
    },
    VExpansionPanelHeader: {
      color: "card"
    },
    VExpansionPanelText: {
      color: "card"
    },
    VCheckbox: {
      color: "primary"
    },
    VSwitch: {
      color: "primary",
      inset: true
    },
    VToolbar: {
      color: "toolbar"
    },
    VBtn: {
      variant: "text"
    },
    VTab: {
      color: "primary"
    },
    VOverlay: {
      backgroundColor: "dark"
    },
    VSlider: {
      color: "primary"
    },
    VTextField: {
      //color: "primary"
      variant: "underlined",
      color: "primary"
    },
    VSelect: {
      color: "primary",
      variant: "underlined"
    },
    VContainer: {
      fluid: true
    },
    VList: {
      bgColor: "card"
    }
  },
  theme: {
    defaultTheme: ["dark", "amoled", "light"].includes(
      localStorage.getItem("theme") || "amoled"
    )
      ? localStorage.getItem("theme") || "amoled"
      : "amoled",
    themes: new DefaultThemes().themes
  }
});

console.log(vuetify.icons);

export default vuetify;
