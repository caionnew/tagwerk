// Browser-Tests gegen dist/index.html (vorher: npm run build). Handygröße wie ein typisches Android-Gerät.
// Eigenes Chromium: CHROMIUM_PATH=/pfad/zu/chrome npm run test:e2e
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir:'tests/e2e',
  timeout:60000,
  fullyParallel:true,
  reporter:process.env.CI ? 'github' : 'list',
  use:{
    viewport:{ width:412, height:860 },
    deviceScaleFactor:2,
    colorScheme:'dark',
    actionTimeout:5000,
    launchOptions:process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {}
  }
});
