const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Rutas de prueba válidas
//   },
// });


