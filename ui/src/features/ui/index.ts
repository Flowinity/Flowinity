import { createSlice, PayloadAction } from "@reduxjs/toolkit"
//import type { RootState } from "../../store"

// Define a type for the slice state
interface UIState {
  text: string
  type: "error" | "success" | "info" | "warning" | null
  show: boolean
}

// Define the initial state using that type
const initialState: UIState = {
  text: "",
  type: null,
  show: false
}
export const uiSlice = createSlice({
  name: "ui",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    triggerSnackbar(state, action: PayloadAction<UIState>) {
      console.log("triggerSnackbar", action)
      state = {
        ...state,
        ...action.payload
      }
      return state
    },
    clearSnackbar(state) {
      console.log("clearSnackbar")
      return (state = initialState)
    }
  }
})

export const { triggerSnackbar, clearSnackbar } = uiSlice.actions

export default uiSlice.reducer
