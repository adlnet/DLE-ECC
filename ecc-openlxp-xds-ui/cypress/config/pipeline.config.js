const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
        console.log(config) // see everything in here!
  
        // modify config values
        config.defaultCommandTimeout = 10000
        config.baseUrl = config.baseUrl
  
        // IMPORTANT return the updated config object
        return config
      },
  
  },
})