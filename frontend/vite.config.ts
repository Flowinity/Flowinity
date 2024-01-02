// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { warmup } from "vite-plugin-warmup";
import graphql from "@rollup/plugin-graphql";

// Utilities
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import ViteVersion from "@troplo/vite-version";
import path from "path";
import * as fs from "fs";

const resolve = (file: string) => {
  return path.resolve(__dirname, file);
};

// https://vitejs.dev/config/

const config = {
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
          /^\/\.well-known\/.*/,
          /^\/graphql\/.*/,
          /^\/gateway\/.*/
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
        name: "PrivateUploader",
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
      autoImport: true
    })
  ],
  define: { "process.env": {} },
  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: resolve("./src/$1") }],
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
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
      "/graphql": "http://localhost:34583",
      "/gateway": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      }
    },
    https: undefined
  }
};

if (process.env.USE_SSL_INTERNAL === "true") {
  //@ts-ignore
  config.server.https = {
    key: fs.readFileSync("./vite.key"),
    cert: fs.readFileSync("./vite.crt")
  };
}

export default defineConfig(config);
