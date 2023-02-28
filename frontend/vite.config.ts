// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import ViteVersion from "@troplo/vite-version";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    emptyOutDir: false
  },
  plugins: [
    ViteVersion(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/i\/.*/]
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "safari-pinned-tab.svg",
        "site.webmanifest",
        "mstile-310x310.png",
        "mstile-310x150.png",
        "mstile-150x150.png",
        "favicon.png",
        "favicon-gold.png",
        "favicon-32x32.png",
        "favicon-16x16.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "browserconfig.xml"
      ],
      manifest: {
        name: "TroploPrivateUploader",
        short_name: "TPU",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: "#101010",
        background_color: "#101010",
        display: "standalone"
      }
    }),
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
      "/i/": "http://localhost:34582",
      "/socket.io": "http://localhost:34582",
      "/api/v1": "http://localhost:34581"
    }
  }
});
