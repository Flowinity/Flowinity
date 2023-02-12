/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDataTable
  },
  defaults: {
    global: {
      ripple: localStorage.getItem("disableRipple") !== "true"
    },
    VDataTable: {
      fixedHeader: true,
      noDataText: "No entries yet..."
    },
    VCard: {
      elevation: 6,
      color: "card",
      rounded: "xl"
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
    },
    VContainer: {
      width: 40
    },
    VExpansionPanel: {
      bgColor: "toolbar"
    },
    VList: {
      bgColor: "card"
    }
  },
  theme: {
    defaultTheme: localStorage.getItem("theme") || "dark",
    themes: {
      dark: {
        colors: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#161616",
          toolbar: "#191919",
          sheet: "#151515",
          text: "#000000",
          dark: "#151515",
          bg: "#121212",
          gold: "#ffd700"
        }
      },
      light: {
        colors: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#dedede",
          toolbar: "#dedede",
          sheet: "#dedede",
          text: "#000000",
          dark: "#dedede",
          bg: "#e7e7e7",
          gold: "#ffd700"
        }
      }
    }
  }
});
