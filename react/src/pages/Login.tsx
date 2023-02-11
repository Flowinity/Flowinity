import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  Snackbar
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Link } from "react-router-dom"
import React from "react"
import axios from "../lib/axios"
import { useAppDispatch } from "../store/hooks"
import { authenticate } from "../features/user"

export default function Login() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const dispatch = useAppDispatch()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      setLoading(true)
      const { data } = await axios.post("/auth/login", {
        email: form.get("username"),
        password: form.get("password"),
        code: form.get("totp")
      })
      setLoading(false)
      localStorage.setItem("token", data.token)
      dispatch(authenticate())
    } catch (e) {
      setLoading(false)
      console.log(e)
      setError("Invalid username or password")
    }
  }

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username or Email Address"
            name="username"
            autoComplete="username"
            autoFocus
            helperText={error}
            error={error !== ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={error}
            error={error !== ""}
          />
          <TextField
            margin="normal"
            fullWidth
            name="totp"
            label="2FA Code"
            type="number"
            id="totp"
            autoComplete="totp"
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <MuiLink to="#" variant="body2" component={Link}>
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink to="#" variant="body2" component={Link}>
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
