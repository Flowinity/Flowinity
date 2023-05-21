import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true
    // run out/cluster.js
    //globalSetup: [path.resolve(__dirname, "./out/test-start.js")]
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./app")
    }
  }
})
