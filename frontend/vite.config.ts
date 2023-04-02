// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "@troplo/vite-plugin-vuetify";

// Utilities
import { defineConfig, PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import ViteVersion from "@troplo/vite-version";
import path from "path";
import * as fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

const resolve = (file: string) => {
  console.log(path.resolve(__dirname, file));
  return path.resolve(__dirname, file);
};
//import obfuscator from "rollup-plugin-obfuscator";

// https://vitejs.dev/config/

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/tpu-main.[hash].js",
        chunkFileNames: "assets/tpu-chunk.[hash].js",
        assetFileNames: "assets/tpu-asset.[hash].[ext]"
      }
    },
    /* rollupOptions: {
      plugins: [
        obfuscator({
          options: {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            identifierNamesGenerator: "hexadecimal",
            log: false,
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: [],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: "variable",
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
          }
        })
      ]
    },*/
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyze-tpu-bundle.html"
    }) as PluginOption,
    ViteVersion(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/i\/.*/, /^\/api\/.*/]
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
    https: {
      key: fs.readFileSync("./vite.key"),
      cert: fs.readFileSync("./vite.crt")
    },
    port: 3000,
    proxy: {
      "/api/v2": "http://localhost:34582",
      "/i/": "http://localhost:34582",
      "/socket.io": {
        target: "http://localhost:34582",
        ws: true
      },
      "/api/v1": "http://localhost:34581"
    }
  }
});
