import { useDispatch } from "react-redux"
import Snackbar from "@mui/material/Snackbar"
import { Icon, IconButton } from "@mui/material"
import { clearSnackbar } from "../features/ui"
import CheckIcon from "@mui/icons-material/Check"
import { useAppSelector, useAppDispatch } from "../store/hooks"

export default function SuccessSnackbar() {
  const dispatch = useAppDispatch()

  const { text, show } = useAppSelector((state) => state.ui)
  function handleClose() {
    dispatch(clearSnackbar())
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={show}
      autoHideDuration={4000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar">
          <Icon>
            <CheckIcon></CheckIcon>
          </Icon>
          {text}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
          <Icon>close</Icon>
        </IconButton>
      ]}
    />
  )
}
