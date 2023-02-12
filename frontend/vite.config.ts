// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
//import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: false
  },
  plugins: [
    // TODO: FIX ME
    /* VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: "TPUvNEXT",
        short_name: "TPUvNEXT",
        theme_color: "#121212",
        background_color: "#121212"
      }
    }),*/
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    })
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 3000,
    proxy: {
      "/api/v2": "http://localhost:34582",
      "/i/": "http://localhost:34581",
      "/socket.io": "http://localhost:34582",
      "/api/v1": "http://localhost:34581"
    }
  }
});
