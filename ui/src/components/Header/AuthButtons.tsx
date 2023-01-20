import { Button } from "@mui/material"
import React from "react"
import { Link } from "react-router-dom"

export function AuthButtons() {
  return (
    <React.Fragment>
      <Button variant="text" color="primary" to="/login" sx={{ mr: 2 }} component={Link}>
        Login
      </Button>
      <Button variant="text" color="primary" to="/register" component={Link}>
        Register
      </Button>
    </React.Fragment>
  )
}
