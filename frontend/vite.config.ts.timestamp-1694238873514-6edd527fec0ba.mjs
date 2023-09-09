// vite.config.ts
import vue from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/vite-plugin-vuetify/dist/index.js";
import { warmup } from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/vite-plugin-warmup/index.js";
import graphql from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/@rollup/plugin-graphql/dist/es/index.js";
import { defineConfig } from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/vite-plugin-pwa/dist/index.mjs";
import ViteVersion from "file:///home/troplo/Documents/GitHub/PrivateUploader/frontend/node_modules/@troplo/vite-version/dist/index.js";
import path from "path";
import * as fs from "fs";
var __vite_injected_original_dirname = "/home/troplo/Documents/GitHub/PrivateUploader/frontend";
var resolve = (file) => {
  return path.resolve(__vite_injected_original_dirname, file);
};
var config = {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/tpu-main.[hash].js",
        chunkFileNames: "assets/tpu-chunk.[hash].js",
        assetFileNames: "assets/tpu-asset.[hash].[ext]"
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    graphql(),
    warmup({
      // warm up the files and its imported JS modules recursively
      clientFiles: ["./src/**/*.ts", "./src/**/*.vue"]
    }),
    //@ts-ignore
    ViteVersion.default(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [
          /^\/i\/.*/,
          /^\/api\/.*/,
          /^\/\.well-known\/.*/
        ]
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
          },
          {
            src: "/maskable_icon.png",
            sizes: "2275x2275",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "maskable"
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
    alias: [{ find: /^@\/(.*)/, replacement: resolve("./src/$1") }],
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 3e3,
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
    https: void 0
  }
};
if (process.env.USE_SSL_INTERNAL === "true") {
  config.server.https = {
    key: fs.readFileSync("./vite.key"),
    cert: fs.readFileSync("./vite.crt")
  };
}
var vite_config_default = defineConfig(config);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS90cm9wbG8vRG9jdW1lbnRzL0dpdEh1Yi9Qcml2YXRlVXBsb2FkZXIvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Ryb3Bsby9Eb2N1bWVudHMvR2l0SHViL1ByaXZhdGVVcGxvYWRlci9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS90cm9wbG8vRG9jdW1lbnRzL0dpdEh1Yi9Qcml2YXRlVXBsb2FkZXIvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjsvLyBQbHVnaW5zXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB2dWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi12dWV0aWZ5XCI7XG5pbXBvcnQgeyB3YXJtdXAgfSBmcm9tIFwidml0ZS1wbHVnaW4td2FybXVwXCI7XG5pbXBvcnQgZ3JhcGhxbCBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tZ3JhcGhxbFwiO1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xuaW1wb3J0IFZpdGVWZXJzaW9uIGZyb20gXCJAdHJvcGxvL3ZpdGUtdmVyc2lvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuXG5jb25zdCByZXNvbHZlID0gKGZpbGU6IHN0cmluZykgPT4ge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgZmlsZSk7XG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuXG5jb25zdCBjb25maWcgPSB7XG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImFzc2V0cy90cHUtbWFpbi5baGFzaF0uanNcIixcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiYXNzZXRzL3RwdS1jaHVuay5baGFzaF0uanNcIixcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiYXNzZXRzL3RwdS1hc3NldC5baGFzaF0uW2V4dF1cIlxuICAgICAgfVxuICAgIH0sXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBlbXB0eU91dERpcjogdHJ1ZVxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZ3JhcGhxbCgpLFxuICAgIHdhcm11cCh7XG4gICAgICAvLyB3YXJtIHVwIHRoZSBmaWxlcyBhbmQgaXRzIGltcG9ydGVkIEpTIG1vZHVsZXMgcmVjdXJzaXZlbHlcbiAgICAgIGNsaWVudEZpbGVzOiBbXCIuL3NyYy8qKi8qLnRzXCIsIFwiLi9zcmMvKiovKi52dWVcIl1cbiAgICB9KSxcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBWaXRlVmVyc2lvbi5kZWZhdWx0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBjbGllbnRzQ2xhaW06IHRydWUsXG4gICAgICAgIHNraXBXYWl0aW5nOiB0cnVlLFxuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrRGVueWxpc3Q6IFtcbiAgICAgICAgICAvXlxcL2lcXC8uKi8sXG4gICAgICAgICAgL15cXC9hcGlcXC8uKi8sXG4gICAgICAgICAgL15cXC9cXC53ZWxsLWtub3duXFwvLiovXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgICAgIFwiZmF2aWNvbi5pY29cIixcbiAgICAgICAgXCJhcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxuICAgICAgICBcInNhZmFyaS1waW5uZWQtdGFiLnN2Z1wiLFxuICAgICAgICBcInNpdGUud2VibWFuaWZlc3RcIixcbiAgICAgICAgXCJtc3RpbGUtMzEweDMxMC5wbmdcIixcbiAgICAgICAgXCJtc3RpbGUtMzEweDE1MC5wbmdcIixcbiAgICAgICAgXCJtc3RpbGUtMTUweDE1MC5wbmdcIixcbiAgICAgICAgXCJmYXZpY29uLnBuZ1wiLFxuICAgICAgICBcImZhdmljb24tZ29sZC5wbmdcIixcbiAgICAgICAgXCJmYXZpY29uLTMyeDMyLnBuZ1wiLFxuICAgICAgICBcImZhdmljb24tMTZ4MTYucG5nXCIsXG4gICAgICAgIFwiYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmdcIixcbiAgICAgICAgXCJhbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgICBcImJyb3dzZXJjb25maWcueG1sXCJcbiAgICAgIF0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIlRyb3Bsb1ByaXZhdGVVcGxvYWRlclwiLFxuICAgICAgICBzaG9ydF9uYW1lOiBcIlRQVVwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvbWFza2FibGVfaWNvbi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIyNzV4MjI3NVwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi9tYXNrYWJsZV9pY29uX3g1MTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgcHVycG9zZTogXCJtYXNrYWJsZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiL21hc2thYmxlX2ljb25feDM4NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM4NHgzODRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvbWFza2FibGVfaWNvbl94MTkyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi9tYXNrYWJsZV9pY29uX3gxMjgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjh4MTI4XCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgcHVycG9zZTogXCJtYXNrYWJsZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiL21hc2thYmxlX2ljb25feDQ4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHRoZW1lX2NvbG9yOiBcIiMxMDEwMTBcIixcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMTAxMDEwXCIsXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiXG4gICAgICB9XG4gICAgfSksXG4gICAgdnVlKHtcbiAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9XG4gICAgfSksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5LWxvYWRlci90cmVlL25leHQvcGFja2FnZXMvdml0ZS1wbHVnaW5cbiAgICB2dWV0aWZ5KHtcbiAgICAgIGF1dG9JbXBvcnQ6IHRydWUsXG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogXCJzcmMvc3R5bGVzL3NldHRpbmdzLnNjc3NcIlxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIGRlZmluZTogeyBcInByb2Nlc3MuZW52XCI6IHt9IH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW3sgZmluZDogL15AXFwvKC4qKS8sIHJlcGxhY2VtZW50OiByZXNvbHZlKFwiLi9zcmMvJDFcIikgfV0sXG4gICAgZXh0ZW5zaW9uczogW1wiLmpzXCIsIFwiLmpzb25cIiwgXCIuanN4XCIsIFwiLm1qc1wiLCBcIi50c1wiLCBcIi50c3hcIiwgXCIudnVlXCJdXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaS92MlwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzQ1ODJcIixcbiAgICAgIFwiL2FwaS92M1wiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzQ1ODJcIixcbiAgICAgIFwiL2FwaS92NFwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzQ1ODJcIixcbiAgICAgIFwiL2kvXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozNDU4MlwiLFxuICAgICAgXCIvc29ja2V0LmlvXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzQ1ODJcIixcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXG4gICAgICB9LFxuICAgICAgXCIvYXBpL3YxXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozNDU4MVwiLFxuICAgICAgXCIvZ3JhcGhxbFwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzQ1ODJcIixcbiAgICAgIFwiL2dhdGV3YXlcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDozNDU4MlwiLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiB0cnVlLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIGh0dHBzOiB1bmRlZmluZWRcbiAgfVxufTtcblxuaWYgKHByb2Nlc3MuZW52LlVTRV9TU0xfSU5URVJOQUwgPT09IFwidHJ1ZVwiKSB7XG4gIC8vQHRzLWlnbm9yZVxuICBjb25maWcuc2VydmVyLmh0dHBzID0ge1xuICAgIGtleTogZnMucmVhZEZpbGVTeW5jKFwiLi92aXRlLmtleVwiKSxcbiAgICBjZXJ0OiBmcy5yZWFkRmlsZVN5bmMoXCIuL3ZpdGUuY3J0XCIpXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhjb25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVcsMEJBQTBCO0FBQzVDLFNBQVMsY0FBYztBQUN2QixPQUFPLGFBQWE7QUFHcEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sVUFBVTtB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
