import React from "react"
import "./App.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/700.css"
import { Box, Container, CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./themes/default"
import routes from "./router"
import Header from "./components/Header"
import { BrowserRouter as Router } from "react-router-dom"

function App() {
  return (
    <>
      <React.StrictMode>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header></Header>
          </ThemeProvider>
          <Container>{routes}</Container>
        </Router>
      </React.StrictMode>
    </>
  )
}

export default App
