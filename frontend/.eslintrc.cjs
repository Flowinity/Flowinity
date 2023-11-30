module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["prettier"],
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "prettier"
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off"
  }
};
