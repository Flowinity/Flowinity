import axios from "axios"
import React from "react"
import { Snackbar } from "@mui/material"
import { useAppDispatch } from "../store/hooks"
import { triggerSnackbar } from "../features/ui"

const instance = axios.create({
  baseURL: "/api/v2"
})

instance.defaults.headers.common["Authorization"] = localStorage.getItem("token") || ""

export default instance
