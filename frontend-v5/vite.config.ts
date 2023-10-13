import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/flowinity-main.[hash].js",
        chunkFileNames: "assets/flowinity-chunk.[hash].js",
        assetFileNames: "assets/flowinity-asset.[hash].[ext]"
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  define: { "process.env": {} },
  server: {
    port: 3000,
    proxy: {
      "/api/v2": "http://localhost:34582",
      "/api/v3": "http://localhost:34582",
      "/api/v4": "http://localhost:34582",
      "/i/": "http://localhost:34582",
      "/socket.io": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/api/v1": "http://localhost:34581",
      "/graphql": "http://localhost:34582",
      "/gateway": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      }
    },
    https: undefined
  }
});
