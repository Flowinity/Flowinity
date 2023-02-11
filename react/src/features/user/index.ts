import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import axios from "../../lib/axios"

// Define a type for the slice state
interface UserState {
  id?: number
  username: string
  email?: string
  description?: string
  administrator?: boolean
  darkTheme?: boolean
  banned?: boolean
  inviteId?: number
  openGraph?: object | number
  discordPrecache?: boolean
  avatar?: string
  subdomainId?: number
  totpEnable?: boolean
  quota?: bigint | number
  uploadNameHidden?: boolean
  invisibleURLs?: boolean
  moderator?: boolean
  subscriptionId?: number
  fakePath?: string
  themeId?: number
  createdAt?: string
  updatedAt?: string
  domainId?: number
  planId?: number
  domain?: object
}

// Define the initial state using that type
const initialState: UserState = {
  id: 0,
  username: "",
  email: "",
  description: "",
  administrator: false,
  darkTheme: true,
  banned: false,
  inviteId: 0,
  openGraph: {},
  discordPrecache: false,
  avatar: "",
  subdomainId: 0,
  totpEnable: false,
  quota: 0,
  uploadNameHidden: false,
  invisibleURLs: false,
  moderator: false,
  subscriptionId: 0,
  fakePath: "",
  themeId: 0,
  createdAt: "",
  updatedAt: "",
  domainId: 0,
  planId: 0,
  domain: {}
}

export const authenticate = createAsyncThunk("user/authenticate", async () => {
  try {
    const { data } = await axios.get("/user")
    return data
  } catch (e) {
    console.log(e)
    throw e
  }
})

export const counterSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      console.log("setUser", action)
      return (state = {
        ...state,
        ...action.payload
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.fulfilled, (state, action) => {
        console.log(action.payload)
        return (state = { ...state, ...action.payload })
      })
      .addCase(authenticate.rejected, (state) => {
        return (state = initialState)
      })
  }
})

export const { setUser } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUsername = (state: RootState) => state.user.username

export default counterSlice.reducer
