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

