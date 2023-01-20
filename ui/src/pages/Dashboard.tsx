import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setUser } from "../features/user"
import { Avatar, Box, Button, Container, Grid, LinearProgress, Paper, Typography } from "@mui/material"

export default function Dashboard() {
  const user = useAppSelector((state) => state.user)

  return (
    <Container maxWidth={false}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper
            sx={{
              pt: 4,
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              pb: 4
            }}
          >
            {user.avatar ? (
              <Avatar sx={{ width: 92, height: 92 }} src={`https://i.troplo.com/i/${user.avatar}`} />
            ) : (
              <Avatar sx={{ width: 92, height: 92 }}>{user.username.charAt(0)}</Avatar>
            )}
            <Typography variant="h4" sx={{ mt: 1 }}>
              {user.username}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {user.description}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              <strong>Created At:</strong> {user.createdAt}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          {/* grid of 4 boxes */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Collections
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Collectivized Items
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Global time spent on TPU
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Users
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Uploads
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Usage
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Pulses
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  pt: 4,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4
                }}
              >
                <Typography variant="h3" sx={{ mt: 1 }}>
                  0/0
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Site Invites
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
