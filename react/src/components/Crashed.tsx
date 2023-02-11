import React from "react"

export default function Crashed() {
  return (
    <div className="crash-parent">
      <div className="crashed title">TPU has crashed.</div>
      <div className="crashed subtitle">Please refresh the page.</div>
      <div className="crashed debug">Check the JavaScript console for more information.</div>
    </div>
  )
}
