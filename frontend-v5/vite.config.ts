import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import graphql from "@rollup/plugin-graphql";
import ViteVersion from "@troplo/vite-version";
import EntryShakingPlugin from "vite-plugin-entry-shaking";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    graphql(),
    vue(),
    vueJsx(),
    // hack for esm
    //@ts-ignore
    ViteVersion.default(),
    EntryShakingPlugin({
      targets: [resolve(__dirname, "node_modules/vue-remix-icons")],
      ignorePatterns: [/node_modules\/(?!vue-remix-icons\/).*/]
    })
  ],
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
      "/api/v3": "http://localhost:34582",
      "/i/": "http://localhost:34582",
      "/socket.io": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/graphql": {
        target: "http://localhost:34583",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/gateway": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      }
    },
    https: undefined
  },
  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: "happy-dom"
  }
});
