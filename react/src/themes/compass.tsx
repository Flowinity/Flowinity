import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import type {} from "@mui/lab/themeAugmentation"
import { ThemeOptions } from "@mui/material"

declare module "@mui/material/styles" {
  interface Palette {
    positive: Palette["primary"]
    destructive: Palette["primary"]
    tertiary: Palette["primary"]
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    positive?: PaletteOptions["primary"]
    destructive?: PaletteOptions["primary"]
    tertiary?: PaletteOptions["primary"]
  }

  interface SimplePaletteColorOptions {
    disabledMain?: string
    disabledText?: string
  }

  interface PaletteColor {
    disabledMain: string
    disabledText: string
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    headerXL: React.CSSProperties
    headerLg: React.CSSProperties
    headerMd: React.CSSProperties
    headerSm: React.CSSProperties
    headerXS: React.CSSProperties
    headerXXS: React.CSSProperties
    bodyMd: React.CSSProperties
    bodySm: React.CSSProperties
    bodyMdStrong: React.CSSProperties
    bodySmStrong: React.CSSProperties
    dialogMd: React.CSSProperties
    dialogSm: React.CSSProperties
    dialogMdStrong: React.CSSProperties
    dialogSmStrong: React.CSSProperties
    dataMd: React.CSSProperties
    dataSm: React.CSSProperties
    dataMdStrong: React.CSSProperties
    dataSmStrong: React.CSSProperties
    pillMd: React.CSSProperties
    tagMd: React.CSSProperties
    badgeMd: React.CSSProperties
    badgeSm: React.CSSProperties
    paragraphMd: React.CSSProperties
    paragraphSm: React.CSSProperties
    paragraphMdStrong: React.CSSProperties
    paragraphSmStrong: React.CSSProperties
    quote: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    headerXL?: React.CSSProperties
    headerLg?: React.CSSProperties
    headerMd?: React.CSSProperties
    headerSm?: React.CSSProperties
    headerXS?: React.CSSProperties
    headerXXS?: React.CSSProperties
    bodyMd?: React.CSSProperties
    bodySm?: React.CSSProperties
    bodyMdStrong?: React.CSSProperties
    bodySmStrong?: React.CSSProperties
    dialogMd?: React.CSSProperties
    dialogSm?: React.CSSProperties
    dialogMdStrong?: React.CSSProperties
    dialogSmStrong?: React.CSSProperties
    dataMd?: React.CSSProperties
    dataSm?: React.CSSProperties
    dataMdStrong?: React.CSSProperties
    dataSmStrong?: React.CSSProperties
    pillMd?: React.CSSProperties
    tagMd?: React.CSSProperties
    badgeMd?: React.CSSProperties
    badgeSm?: React.CSSProperties
    paragraphMd?: React.CSSProperties
    paragraphSm?: React.CSSProperties
    paragraphMdStrong?: React.CSSProperties
    paragraphSmStrong?: React.CSSProperties
    quote?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    headerXL: true
    headerLg: true
    headerMd: true
    headerSm: true
    headerXS: true
    headerXXS: true
    bodyMd: true
    bodySm: true
    bodyMdStrong: true
    bodySmStrong: true
    dialogMd: true
    dialogSm: true
    dialogMdStrong: true
    dialogSmStrong: true
    dataMd: true
    dataSm: true
    dataMdStrong: true
    dataSmStrong: true
    pillMd: true
    tagMd: true
    badgeMd: true
    badgeSm: true
    paragraphMd: true
    paragraphSm: true
    paragraphMdStrong: true
    paragraphSmStrong: true
    quote: true
    h1: true
    h2: true
    h3: true
    h4: true
    h5: true
    h6: true
    subtitle1: true
    subtitle2: true
    body1: true
    body2: true
    caption: true
    overline: true
  }
}

type ThemeProps = {
  children: React.ReactNode //👈 children prop type
}

const globalTheme = createTheme({
  palette: {
    nav: "#fff",
    primary: {
      light: "#0E6CD9",
      main: "#004FAC",
      dark: "#003F8A",
      disabledMain: "#63abff",
      disabledText: "#fff"
    },
    secondary: {
      light: "#EAEBEE",
      main: "#D4D7DC",
      dark: "#BFC3CB",
      contrastText: "#000"
    },
    destructive: {
      light: "#C80E0E",
      main: "#A00B0B",
      dark: "#780808",
      contrastText: "#fff"
    },
    positive: {
      light: "#16885F",
      main: "#0F5F43",
      dark: "#0B4430",
      contrastText: "#fff"
    },
    tertiary: {
      light: "#0E6CD9",
      main: "#0E6CD9",
      dark: "#0E6CD9",
      contrastText: "#0E6CD9"
    }
  },
  typography: {
    fontFamily: ["Cabin", "Roboto", "Arial", "Helvetica", "sans-serif"].join(","),
    button: {
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: "150%"
    },
    headerXL: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: "134%"
    },
    headerLg: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: "136%"
    },
    headerMd: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: "132%"
    },
    headerSm: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: "138%"
    },
    headerXS: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: "136%"
    },
    headerXXS: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: "150%"
    },
    bodyMd: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "150%"
    },
    bodySm: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "168%"
    },
    bodyMdStrong: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: "150%"
    },
    bodySmStrong: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: "168%"
    },
    dialogMd: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "150%"
    },
    dialogSm: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "146%"
    },
    dialogMdStrong: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: "150%"
    },
    dialogSmStrong: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: "146%"
    },
    dataMd: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "150%"
    },
    dataSm: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "168%"
    },
    dataMdStrong: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: "150%"
    },
    dataSmStrong: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: "168%"
    },
    pillMd: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "168%"
    },
    tagMd: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "168%"
    },
    badgeMd: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: "168%"
    },
    badgeSm: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: "160%"
    },
    paragraphMd: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "172%"
    },
    paragraphSm: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "168%"
    },
    paragraphMdStrong: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: "172%"
    },
    paragraphSmStrong: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: "168%"
    },
    quote: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: "150%",
      fontStyle: "italic"
    }
  }
  //spacing: (factor: number) => `${0.25 * factor}rem`,
})

// @ts-ignore
const theme = createTheme(globalTheme, {
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder ": {
            color: globalTheme.palette.grey[800],
            opacity: 1
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-containedPrimary.Mui-disabled": {
            backgroundColor: globalTheme.palette.primary.disabledMain,
            color: globalTheme.palette.primary.disabledText
          },
          "&.MuiButton-outlinedSecondary": {
            color: globalTheme.palette.secondary.contrastText
          },
          "&.MuiButton-outlinedSecondary.Mui-disabled": {
            opacity: 0.4
          },
          "&.MuiButton-outlinedTertiary.Mui-disabled": {
            opacity: 0.4,
            color: globalTheme.palette.tertiary.contrastText,
            borderColor: globalTheme.palette.tertiary.main
          },
          "&.MuiButton-containedPositive.Mui-disabled": {
            backgroundColor: globalTheme.palette.positive.main,
            opacity: 0.4,
            color: globalTheme.palette.positive.contrastText
          },
          "&.MuiButton-containedDestructive.Mui-disabled": {
            backgroundColor: globalTheme.palette.destructive.main,
            opacity: 0.4,
            color: globalTheme.palette.destructive.contrastText
          }
        }
      }
    },
    MuiLoadingButton: {
      styleOverrides: {
        /* loadingIndicator: ({ ownerState, theme }) => ({
          ...((ownerState.variant === "contained" && {
            color: theme.palette.primary.contrastText
          }) ||
            (ownerState.color === "tertiary" && {
              color: theme.palette.tertiary.contrastText
            }))
        })*/
      }
    }
  }
} as ThemeOptions)

export default theme
