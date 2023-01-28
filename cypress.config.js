const { defineConfig } = require("cypress");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://staging.lpitko.ru",
    testIsolation: false,
    specPattern: "**/*.feature",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);
      allureWriter(on, config);

      return config;
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true,
    },
  },
});

