// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig, // Diziyi yayarak kullanmamız gerekebilir
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      "import/namespace": "off",
      "dot-notation": "off",
    },
  },
]);
