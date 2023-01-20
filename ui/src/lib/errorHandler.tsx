import React from "react"
import Crashed from "../components/Crashed"

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: "" }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  async componentDidMount() {
    window.addEventListener("error", (e) => {
      // if not axios error
      if (e.message !== "Network Error") {
        this.setState({ hasError: true, error: e.error })
      }
    })
  }
  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Crashed></Crashed>
    }
    // @ts-ignore
    return this.props.children
  }
}

export default ErrorBoundary
