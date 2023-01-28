# e2e-santa project with BDD (Cucumber)

## To instal Cucmber for Cypress 10 in the project you will need:

Install the @badeball/cypress-cucumber-preprocessor using the command: `npm install -D @badeball/cypress-cucumber-preprocessor`

Install one more dependencies ‘@bahmutov/cypress-esbuild-preprocessor’ using the command: `npm install -D @bahmutov/cypress-esbuild-preprocessor`

Update your cypress.config.js for cucumber preprocessor:

```
const { defineConfig } = require(“cypress”);
const createBundler = require(“@bahmutov/cypress-esbuild-preprocessor”);
const addCucumberPreprocessorPlugin =
require(“@badeball/cypress-cucumber-preprocessor”).addCucumberPreprocessorPlugin;
const createEsbuildPlugin = require(“@badeball/cypress-cucumber-preprocessor/esbuild”).createEsbuildPlugin;
module.exports = defineConfig({
e2e: {
    setupNodeEvents(on, config) {
        const bundler = createBundler({
            plugins: [createEsbuildPlugin(config)],
        });

        on(“file:preprocessor”, bundler);
        addCucumberPreprocessorPlugin(on, config);
        return config;
    },
    specPattern: “**/*.feature”,
},
});
```

Use `Cucumber (Gherkin) Full Support` plugin for VS Code

## To use Allure reports with the project

1. Install the Allure following the instructions from [here](https://docs.qameta.io/allure/#_how_to_proceed)

2. Install the cypress-allure-plugin or run the command `npm install` - to get all packages

3. run commands:

   `npm run pretest:clear` - in case you need to clear directories with the previos results

   `npm run cy:run:with:allure` - to run the tests and generate the Allure report

   `npm run allure:open` - to open the Allure report

