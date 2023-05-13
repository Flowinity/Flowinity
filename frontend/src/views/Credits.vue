<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Credits</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title>
          TPU was made possible by the following people:
        </v-card-title>
        <UserCard username="Troplo" subtitle="Lead Developer"></UserCard>
        <UserCard username="remy" subtitle="Infrastructure Manager"></UserCard>
        <UserCard username="electrics01" subtitle="Code Contributor"></UserCard>
        <UserCard
          username="bytedefined"
          subtitle="Code Contributor / Ideas"
        ></UserCard>
        <UserCard
          username="Jolt707"
          subtitle="Code Contributor / Moral Support, sometimes"
        ></UserCard>
        <UserCard
          username="Avinera"
          subtitle="Buys me my favorite beverage, Pepsi Max"
        ></UserCard>
        <UserCard username="Spy" subtitle="Buys me lunch"></UserCard>
        <v-card-subtitle>... and everyone else!</v-card-subtitle>
        <v-card-title class="mt-3">
          TPU was made possible by the following open source projects:
        </v-card-title>
        <ul class="ml-8">
          <li v-for="pkg in items">
            {{ pkg }}
          </li>
        </ul>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserCard from "@/components/Users/UserCard.vue";

export default defineComponent({
  name: "Credits",
  components: { UserCard },
  data() {
    return {
      frontend: [
        "@vitejs/plugin-vue",
        "@vue/eslint-config-typescript",
        "cypress",
        "eslint",
        "eslint-plugin-vue",
        "rollup-plugin-visualizer",
        "sass",
        "typescript",
        "vite",
        "vite-plugin-pwa",
        "vue-tsc",
        "@codemirror/autocomplete",
        "@codemirror/basic-setup",
        "@codemirror/lang-css",
        "@codemirror/view",
        "@editorjs/attaches",
        "@editorjs/checklist",
        "@editorjs/code",
        "@editorjs/delimiter",
        "@editorjs/editorjs",
        "@editorjs/embed",
        "@editorjs/header",
        "@editorjs/image",
        "@editorjs/inline-code",
        "@editorjs/link",
        "@editorjs/list",
        "@editorjs/marker",
        "@editorjs/paragraph",
        "@editorjs/quote",
        "@editorjs/raw",
        "@editorjs/table",
        "@editorjs/warning",
        "@guolao/vue-monaco-editor",
        "@highlightjs/vue-plugin",
        "@mdi/font",
        "@svgmoji/noto",
        "@troplo/tpu-editorjs-nested-list",
        "@troplo/tpu-simple-image",
        "@troplo/vite-version",
        "@troplo/vuetify",
        "@vuetify/nightly",
        "apexcharts",
        "axios",
        "chart.js",
        "codeflask",
        "codemirror",
        "core-js",
        "cropperjs",
        "dayjs",
        "dompurify",
        "editorjs-header-with-anchor",
        "editorjs-text-alignment-blocktune",
        "editorjs-text-color-plugin",
        "editorjs-undo",
        "floating-vue",
        "markdown-it",
        "markdown-it-emoji",
        "markdown-it-unicode-emoji",
        "monaco-editor",
        "pinia",
        "qrcode.vue",
        "socket.io-client",
        "svgmoji",
        "textarea-caret",
        "vue",
        "vue-axios",
        "vue-chartjs",
        "vue-codemirror",
        "vue-cropperjs",
        "vue-draggable-plus",
        "vue-matomo",
        "vue-mention",
        "vue-router",
        "vue-toastification",
        "vue3-apexcharts",
        "vuetify",
        "webfontloader"
      ],
      backend: [
        "@alt3/sequelize-to-json-schemas",
        "@levminer/speakeasy",
        "@socket.io/redis-adapter",
        "argon2",
        "axios",
        "body-parser",
        "bullmq",
        "cache-manager",
        "class-transformer",
        "class-validator",
        "cookie-parser",
        "cors",
        "crypto-random-string",
        "dayjs",
        "debug",
        "ejs",
        "express",
        "express-promise-router",
        "express-rate-limit",
        "http-status-codes",
        "husky",
        "imapflow",
        "jsonwebtoken",
        "jw-paginate",
        "mailgen",
        "mailparser",
        "mariadb",
        "maxmind",
        "md5",
        "module-alias",
        "multer",
        "node-cron",
        "node-tesseract-ocr",
        "nodemailer",
        "prettier",
        "probe-image-size",
        "rate-limit-redis",
        "redis",
        "reflect-metadata",
        "routing-controllers",
        "routing-controllers-openapi",
        "sequelize",
        "sequelize-pool",
        "sequelize-typescript",
        "serve-favicon",
        "sharp",
        "socket.io",
        "swagger-jsdoc",
        "swagger-ui-express",
        "tsoa",
        "typedi",
        "ua-parser-js",
        "uuid",
        "zod",
        "chai",
        "cross-env",
        "eslint",
        "eslint-config-prettier",
        "eslint-import-resolver-typescript",
        "eslint-plugin-deprecation",
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-prettier",
        "eslint-plugin-unicorn",
        "mocha",
        "nodemon",
        "nyc",
        "rimraf",
        "sinon",
        "source-map-support",
        "supertest",
        "swagger-autogen",
        "ts-node",
        "tsc-watch",
        "tsconfig-paths",
        "typescript"
      ]
    };
  },
  computed: {
    items() {
      // include frontend and backend packages and order them alphabetically and remove duplicates
      return [...this.frontend.sort(), ...this.backend.sort()]
        .sort()
        .filter((item, index, array) => array.indexOf(item) === index);
    }
  }
});
</script>

<style scoped></style>
