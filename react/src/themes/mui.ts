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
    nav: "#181818"
  }
})

export default theme
