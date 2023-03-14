/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "@troplo/vuetify/styles";
//import "/home/troplo/GitHub/vuetify/packages/vuetify/src/styles/main.sass";

// Composables

import { createVuetify } from "@troplo/vuetify";
import { VDataTable } from "@troplo/vuetify/labs/VDataTable";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDataTable
  },
  defaults: {
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
    VAutoComplete: {
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
    defaultTheme: ["dark", "amoled", "light"].includes(localStorage.getItem("theme")) ? localStorage.getItem("theme") : "dark",
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
          background: "#121212",
          gold: "#ffd700"
        }
      },
      amoled: {
        colors: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#000000",
          toolbar: "#121212",
          sheet: "#000000",
          text: "#000000",
          dark: "#000000",
          gold: "#ffd700",
          background: "#000000"
        },
        dark: true
      },
      light: {
        colors: {
          primary: "#0190ea",
          secondary: "#555555",
          accent: "#121212",
          error: "#f44336",
          info: "#2196f3",
          success: "#4caf50",
          warning: "#ff9800",
          card: "#ffffff",
          toolbar: "#f5f5f5",
          sheet: "#fafafa",
          text: "#333333",
          dark: "#f7f7f7",
          background: "#f5f5f5",
          gold: "#ffd700"
        }
      }
    }
  }
});
