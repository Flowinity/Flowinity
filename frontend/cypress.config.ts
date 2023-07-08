import {defineConfig} from "cypress"

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite"
    }
  },

  e2e: {
    setupNodeEvents(on, config): void {
      // Implement node event listeners here.
    }
  }
})
