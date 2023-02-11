import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

declare module "@mui/material/styles" {
  interface Palette {
    nav: string
  }
  interface PaletteOptions {
    nav: string
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    nav: true
  }
}

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: ["Inter"].join(",")
  },
  palette: {
    mode: "dark",
    background: {
      default: "#121212"
    },
    primary: {
      main: "#0190ea"
    },
    secondary: {
      main: "#757575"
    },
    error: {
      main: red.A400
    },
    info: {
      main: "#2196F3"
    },
    success: {
      main: "#4CAF50"
    },
    warning: {
      main: "#ff9800"
    },
    nav: "#151515"
  }
})

export default theme
